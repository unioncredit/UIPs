const {ethers} = require("hardhat");
const AssetManagerABI = require("../../abis/AssetManager.json");
const arbProposeParams = require("../../utils/arbProposeParams.js");

async function getProposalParams({assetManagerAddress, adapterAddress}) {
    if (!adapterAddress || !assetManagerAddress) {
        throw new Error("address error");
    }

    const assetManager = await ethers.getContractAt(AssetManagerABI, assetManagerAddress);
    const actions = [
        [
            ["address"],
            [adapterAddress],
            assetManagerAddress,
            "0",
            assetManager.interface.encodeFunctionData("addAdapter(address)", [adapterAddress])
        ]
    ];
    //L1 address
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    let targets = [],
        values = [],
        sigs = [],
        calldatas = [],
        signedCalldatas = [];
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
UIP-005: Add Aave V3 Support on Arbitrum

## Intro
This is a change to the protocol, and therefore will go through the UIP process.

## Motivation
Currently, all unlent DAI in Union on Arbitrum is stored in a puretoken DAI adapter. Now that aave V3 has been deployed to Arbitrum, an adapter can be written to support depositing a portion of deposited DAI in aave V3 to earn interest.

## Proposal / Solution
Create an AssetManager Adapter that works with Aave V3 to deposit a portion of unlent DAI to Aave V3 on Arbitrum to earn interest and rewards.

### Main functions:
- deposit() - deposit DAI in AssetManager to Aave to earn interest.
- withdraw() - withdraw DAI from Aave and move to AssetManager.
- claimRewards() - get the rewarded Aave token.

### Parameters
- Set PureTokenAdapter floor of 25,000 DAI
- Set Aave V1 adapter to floor of 25,000 DAI
- Set Aave V1 adapter to ceiling of 500,000 DAI
- Set PureTokenAdapter to ceiling of 500,000 DAI

## Defining Success
Be able to deposit to / withdraw from Aave, and be able to claim rewards token from Aave on Arbitrum.

## Backwards Compatibility
No issues with backwards compatibility for this proposal

## Test Cases
Tests and simulations can be found here: [Link to PR](https://github.com/unioncredit/union-v1-contracts/pull/106)

## Implementation
- Create and deploy AaveV3Adapter.
- Set AaveV3Adapter floor to 25,000 DAI
- Set AaveV3Adapter ceiling to 500,000 DAI
- Set AaveV3Adapter mapTokenToAToken
- Call AssetManager.addAdapter() to add AaveV3Adapter.

`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
