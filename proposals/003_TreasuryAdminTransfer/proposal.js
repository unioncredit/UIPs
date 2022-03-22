const {ethers} = require("hardhat");

async function getProposalParams({treasuryAddress}) {
    if (!treasuryAddress) {
        throw new Error("address error");
    }

    const targets = [treasuryAddress];
    const values = ["0"];
    const sigs = ["acceptAdmin()"];
    const calldatas = [ethers.utils.defaultAbiCoder.encode([], [])];
    const msg = `
UIP-003: Transfer treasury's ownership to Timelock

# Simple Summary

In short, as part of progressive decentralization, this proposal transfers ownership of the treasury from Admin key to DAO governance. In order to execute https://unioncredit.slite.com/app/docs/LKtqwvcEiQDocE, the treasury's ownership must belong to Timelock. This proposal executes the transfer of ownership.

# Motivation

Increasing decentralization is the primary motivation. In addition, to execute UIP 0004, setting up a UNION drip from Mainnet to Arbitrum One, treasury ownership must be transferred to Timelock from Admin key.

# Specification

- Prerequisites: Set the 'newAdmin' property of the Treasury contract to be the Timelock's address (0xBBD3321f377742c4b3fe458b270c2F271d3294D8).
- Call the function 'acceptAdmin()' of the Treasury contract to set its 'admin' property.

# Test Cases

Simulation on mainnet here: https://github.com/unioncredit/union-v1-proposals/blob/uip/003-treasury-admin-transfer/proposals/003_TreasuryAdminTransfer/testProposal.js

# Implementation

- Call the function 'acceptAdmin()' of the Treasury contract

# Security Considerations

Make sure the new admin is Timelock's address. UIP 0003 and UIP 0004 could have been completed together, but as this change pertains to the treasury, and abundance of caution is beneficial to limit risk. Therefore, the changes were split up into individual proposals and will be handled one at a time.

`;

    const TreasuryABI = require("../../abis/Treasury.json");
    const iface = new ethers.utils.Interface(TreasuryABI);
    const signedCalldatas = [];
    for (i = 0; i < sigs.length; i++) {
        console.log({sig: sigs[i], calldata: calldatas[i]});
        signedCalldatas.push(iface.encodeFunctionData(sigs[i], calldatas[i] == "0x" ? [] : calldatas[i]));
    }
    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
