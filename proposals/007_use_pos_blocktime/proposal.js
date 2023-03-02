const {ethers} = require("hardhat");
const uTokenABI = require("../../abis/UToken.json");
const interestRateModelABI = require("../../abis/FixedInterestRateModel.json");

const arbProposeParams = require("../../utils/arbProposeParams.js");

async function getProposalParams(addresses) {
    const {uDaiAddr, uDaiAddrL2, interestRateAddr, interestRateAddrL2} = addresses;
    console.log({uDaiAddr, uDaiAddrL2, interestRateAddr, interestRateAddrL2});

    if (!uDaiAddr || !uDaiAddrL2 || !interestRateAddr || !interestRateAddrL2) {
        throw new Error("address error");
    }

    //L1 address
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";

    // Update interest rate per block
    const interestRateModel = await ethers.getContractAt(interestRateModelABI, interestRateAddr);
    const newInterestRate = "38051750380"; // 10% APR, 38051750380 x 7200 (blocks per day) x 365
    const setInterestRateCalldata = interestRateModel.interface.encodeFunctionData("setInterestRate(uint256)", [
        newInterestRate
    ]);

    // Update overdue blocks
    const uDai = await ethers.getContractAt(uTokenABI, uDaiAddr);
    const newOverdueBlocks = "216000"; // 30 days assuming a 12s blocktime
    const setOverdueBlocksCalldata = uDai.interface.encodeFunctionData("setOverdueBlocks(uint256)", [newOverdueBlocks]);

    // Update mainnet
    let targets = [interestRateAddr, uDaiAddr],
        values = ["0", "0"],
        sigs = ["setInterestRate(uint256)", "setOverdueBlocks(uint256)"],
        calldatas = [
            ethers.utils.defaultAbiCoder.encode(["uint256"], [newInterestRate]),
            ethers.utils.defaultAbiCoder.encode(["uint256"], [newOverdueBlocks])
        ],
        signedCalldatas = [setInterestRateCalldata, setOverdueBlocksCalldata];

    // Update Arbitrum
    const actions = [
        [["uint256"], [newInterestRate], interestRateAddrL2, "0", setInterestRateCalldata],
        [["uint256"], [newOverdueBlocks], uDaiAddrL2, "0", setOverdueBlocksCalldata]
    ];
    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const {target, value, signature, calldata, signCalldata} = await arbProposeParams(
            action[0], // types
            action[1], // params
            action[2], // target
            action[3], // values
            action[4], // calldata
            excessFeeRefundAddress,
            callValueRefundAddress
        );
        targets.push(target);
        values.push(value);
        sigs.push(signature);
        calldatas.push(calldata);
        signedCalldatas.push(signCalldata);
    }

    const msg = `
UIP-007: Adapt to PoS blocktime

# Abstract

- Change the interest rate per block from 41668836919 to 38051750380
- Change overdue period blocks from 197250 to 216000

# Motivation

Now that PoS has passed and enough time passed to get an accurate Blocks per year. It's necessary to adjust.

# Specification

- To calculate the new interest rate per block, we use the PoS block time of approximately 12 seconds, and the targeted 10% interest rate per annum, which is 1e17. Therefore, the calculation would be 1e17 / 2,628,000, which results in 38051750380
- To calculate the number of new overdue blocks, we use the PoS block time of approximately 12 seconds and a 30-day overdue period. Therefore, the calculation would be (3600 * 24 * 30) / 12, which results in 216,000

# Test Cases

Tests and simulations can be found here: [PR](https://github.com/unioncredit/UIPs/pull/15)

# Implementation

For Mainnet:
- Call [FixedInterestRateModel](https://etherscan.io/address/0xfDd998ce04AB8f48B473cE4C9af1C2F8F8E264Eb).setInterestRate("38051750380") to update the interest rate per block
- Call [UToken](https://etherscan.io/address/0x954F20DF58347b71bbC10c94827bE9EbC8706887).setOverdueBlocks("216000") to change the loan overdue period

For Arbitrum
- Call [FixedInterestRateModel](https://arbiscan.io/address/0x051e2514E3fE8da88CaA2951442a21042BCe99Ea).setInterestRate("38051750380") to update the interest rate per block
- Call [UToken](https://arbiscan.io/address/0x954F20DF58347b71bbC10c94827bE9EbC8706887).setOverdueBlocks("216000") to change the loan overdue period

`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
