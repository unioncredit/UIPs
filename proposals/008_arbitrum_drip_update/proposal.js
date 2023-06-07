const {ethers} = require("hardhat");
const ComptrollerABI = require("../../abis/Comptroller.json");
const TreasuryABI = require("../../abis/Treasury.json");

const arbProposeParams = require("../../utils/arbProposeParams.js");

async function getProposalParams(addresses) {
    const {treasuryAddr, arbConnectorAddr, arbComptrollerAddr} = addresses;
    console.log({treasuryAddr, arbConnectorAddr});

    if (!treasuryAddr || !arbConnectorAddr) {
        throw new Error("address error");
    }

    //L1 address
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";

    // Update treasury's dripping schedule for Arbitrum
    const treasury = await ethers.getContractAt(TreasuryABI, treasuryAddr);
    const latestBlock = await ethers.provider.getBlock("latest");
    console.log({latestBlock});
    const dripStart = latestBlock.number; // the current block number
    const dripRate = ethers.utils.parseEther("1"); // 1 UNION per block
    const target = arbConnectorAddr;
    const amount = ethers.utils.parseEther("1296000"); // For 6 months, it's 15,552,000 seconds. Assuming a 12 second block, it'll be 1,296,000 UNION
    const editScheduleCalldata = treasury.interface.encodeFunctionData(
        "editSchedule(uint256,uint256,address,uint256)",
        [dripStart, dripRate, target, amount]
    );

    // Actions for mainnet
    let targets = [treasuryAddr],
        values = ["0"],
        sigs = ["editSchedule(uint256,uint256,address,uint256)"],
        calldatas = [
            ethers.utils.defaultAbiCoder.encode(
                ["uint256", "uint256", "address", "uint256"],
                [dripStart, dripRate, target, amount]
            )
        ],
        signedCalldatas = [editScheduleCalldata];

    // Update half decay point
    const arbComptroller = await ethers.getContractAt(ComptrollerABI, arbComptrollerAddr);
    const newHalfDecayPoint = "250000";
    const setHalfDecayPointCalldata = arbComptroller.interface.encodeFunctionData("setHalfDecayPoint(uint256)", [
        newHalfDecayPoint
    ]);

    // Actions for Arbitrum
    const actions = [[["uint256"], [newHalfDecayPoint], arbComptrollerAddr, "0", setHalfDecayPointCalldata]];
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
UIP-008: Change Arbitrum dripping schedule and update half decay point of the Comptroller

# Abstract

- Drip of 1 UNION for 6 months to the Comptroller on Arbitrum.

- Set half decay point of the Arbitrum Comptroller to 250,000.

# Motivation

As there is not yet a v2 deployment on Arbitrum, we propose to continue a 1 UNION per block drip for the next 6 months to the users of Union on Arbitrum. At the end of the 6 months we can revisit the question, as it seems likely there will either be an Arbitrum v2 deployment or everyone will have migrated to Union v2 on Optimism.

We also propose lowering the half-decay point to 250k. Now that v2 is insured it doesn't make sense to continue to over incentivize TVL on v1. 

# Specification

- Call Treasury.editSchedule() to change the dripping schedule for Arbitrum. Set the dripStart to be the block number when executed, dripRate to be 1 ether, target to be ArbConnector (0x307ED81138cA91637E432DbaBaC6E3A42699032a), and amount to be 1,296,000

- Set the half decay point of the Arbitrum Comptroller to 250,000

# Test Cases

Tests and simulations can be found here: [PR](https://github.com/unioncredit/UIPs/pull/17)

# Implementation

For Mainnet:
- Call [Treasury](https://etherscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9).editSchedule() to update the dripping schedule for the Arbitrum.

For Arbitrum
- Call [Comptroller](https://arbiscan.io/address/0x641DD6258cb3E948121B10ee51594Dc2A8549fe1).setHalfDecayPoint("250000") to set the half decay point to 250,000.

`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
