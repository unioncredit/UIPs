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
UIP-008: Create new drip schedule for Arbitrum

# Abstract

# Motivation

# Specification

# Test Cases

# Implementation

`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
