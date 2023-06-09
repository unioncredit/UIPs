const {ethers} = require("hardhat");
const TreasuryABI = require("../../abis/Treasury.json");

async function getProposalParams(addresses) {
    const {treasuryAddr, opConnectorAddr} = addresses;
    console.log({treasuryAddr, opConnectorAddr});

    if (!treasuryAddr || !opConnectorAddr) {
        throw new Error("address error");
    }

    //L1 address
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";

    // Update treasury's dripping schedule for Optimism
    const treasury = await ethers.getContractAt(TreasuryABI, treasuryAddr);
    const latestBlock = await ethers.provider.getBlock("latest");
    console.log({latestBlock});
    const dripStart = latestBlock.number; // the current block number
    const dripRate = ethers.utils.parseEther("1"); // 1 UNION per block
    const target = opConnectorAddr;
    const amount = ethers.utils.parseEther("2628000"); // For 12 months, it's 31,536,000 seconds. Assuming a 12 second block, it'll be 2,628,000 UNION
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

    const msg = `
UIP-009: Change Optimism reward schedule

# Abstract

- Change Optimism drip schedule to 1 UNION for 12 months

# Motivation

We propose to continue a 1 UNION per block drip for the next 6 months to the users of Union on Optimism.

# Specification

- Call Treasury.editSchedule() to change the dripping schedule for Optimism. Set the dripStart to be the block number when executed, dripRate to be 1 ether, target to be OpConnector (0xF5690129Bf7AD35358Eb2304f4F5B10E0a9B9d65), and amount to be 2628000

# Test Cases

Tests and simulations can be found here: [PR](https://github.com/unioncredit/UIPs/pull/18)

# Implementation

For Mainnet:
- Call [Treasury](https://etherscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9).editSchedule() to update the dripping schedule for the Optimism.

`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
