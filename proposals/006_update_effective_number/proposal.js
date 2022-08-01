const {ethers} = require("hardhat");
const sumOfTrustABI = require("../../abis/SumOfTrust.json");
const arbProposeParams = require("../../utils/arbProposeParams.js");

async function getProposalParams({sumOfTrustAddr, sumOfTrustAddrL2}) {
    if (!sumOfTrustAddr || !sumOfTrustAddrL2) {
        throw new Error("address error");
    }

    const sumOfTrust = await ethers.getContractAt(sumOfTrustABI, sumOfTrustAddr);
    const actions = [
        [
            ["uint256"],
            ["1"],
            sumOfTrustAddrL2,
            "0",
            sumOfTrust.interface.encodeFunctionData("setEffectNumber(uint256)", ["1"])
        ]
    ];
    //L1 address
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    let targets = [sumOfTrustAddr],
        values = ["0"],
        sigs = ["setEffectNumber(uint256)"],
        calldatas = [ethers.utils.defaultAbiCoder.encode(["uint256"], ["1"])],
        signedCalldatas = [sumOfTrust.interface.encodeFunctionData("setEffectNumber(uint256)", ["1"])];
    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const {target, value, signature, calldata, signCalldata} = await arbProposeParams(
            //types,params,target,value,calldata
            action[0],
            action[1],
            action[2],
            action[3],
            action[4],
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
UIP-006: Dropping the Effective Number from 3 to 1

# Abstract

Right now, the number of vouches required to become a Union member is 3. This requirement is called the “effective number.” This proposal will change the effective number from 3 to 1. It's important for protocol health for the global average number of edges per node to be >1. With this proposal we plan to drop the hard requirement to 1 and monitor where the actual averages end up. 

# Motivation

The goal of changing the effective number is to facilitate user interaction with the protocol. Dropping the effective number affects two aspects of user interaction: onboarding and follow-through.
- Streamline onboarding: Dropping the effective number to 1 allows for current members to onboard their community members quickly, and promotes local network growth.
- Increase membership follow-through: A current issue with the effective number being 3 is that if someone is missing one or two of the vouches required to become a member, they are less likely to follow through on membership completion. This problem also gates people from vouching for others. Reducing the amount of vouches required to become a member will result in a higher rate of membership completion.

# Specification

Change the 'effectiveNumber' in [SumOfTrust](https://github.com/unioncredit/union-v1-contracts/blob/master/contracts/user/SumOfTrust.sol) from '3' to '1'.

# Backwards Compatibility

Existing Union members with 3 or more vouches should still work as previously.

# Test Cases

Tests and simulations can be found here: [Link to PR](https://github.com/unioncredit/UIPs/pull/12)

# Implementation

Set the 'effectiveNumber' of [SumOfTrust](https://github.com/unioncredit/union-v1-contracts/blob/master/contracts/user/SumOfTrust.sol)  to '1' by calling 'SumOfTrust.setEffectiveNumber(1)'
Link to PR: https://github.com/unioncredit/UIPs/pull/12

# Security Considerations

One of the implications is that if only one member is vouching for you, and someone else is borrowing against that person’s vouch, your total amount of available credit could go down to 0. The possibility of a member’s available credit being dependent on only one credit provider should encourage the user to onboard more members as underwriters, and incentivize users to not rely on a sole credit provider.
`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
