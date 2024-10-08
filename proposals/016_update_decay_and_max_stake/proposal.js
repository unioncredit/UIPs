const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const OpOwnerABI = require("../../abis/OpOwner.json");
const ComptrollerABI = require("../../abis/Comptroller.json");
const arbProposeParams = require("../../utils/arbProposeParams.js");

async function getProposalParams(addresses) {
    const {
        opOwnerAddr,
        comptrollerAddr,
        arbComptrollerAddr,
        opComptrollerAddr,
        opUserManagerAddr,
        optimismBridgeAddress
    } = addresses;

    const comptroller = await ethers.getContractAt(ComptrollerABI, comptrollerAddr);
    const ethHalfdecayPoint = 10000;
    const setHalfDecayPointCalldata = comptroller.interface.encodeFunctionData("setHalfDecayPoint(uint256)", [
        ethHalfdecayPoint
    ]);

    const iface = new Interface([
        "function sendMessage(address,bytes,uint32) external",
        "function setHalfDecayPoint(uint256) external",
        "function setMaxStakeAmount(uint96) external"
    ]);
    // Actions for mainnet
    let targets = [comptrollerAddr],
        values = ["0"],
        sigs = ["setHalfDecayPoint(uint256)"],
        calldatas = [ethers.utils.defaultAbiCoder.encode(["uint256"], [ethHalfdecayPoint])],
        signedCalldatas = [setHalfDecayPointCalldata];

    // Actions for Arbitrum
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const arbHalfDecayPoint = 1000;
    const arbSetHalfDecayPointCalldata = iface.encodeFunctionData("setHalfDecayPoint(uint256)", [arbHalfDecayPoint]);
    const actions = [[["uint256"], [arbHalfDecayPoint], arbComptrollerAddr, "0", arbSetHalfDecayPointCalldata]];
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

    // Actions for Optimism
    const gasLimit = 2000000;

    const opOwner = await ethers.getContractAt(OpOwnerABI, opOwnerAddr);

    // set half decay
    const opHalfDecayPoint = 100000;
    const opSetHalfDecayPointCalldata = iface.encodeFunctionData("setHalfDecayPoint(uint256)", [opHalfDecayPoint]);
    const executeOpSetHalfDecay = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opComptrollerAddr,
        0,
        opSetHalfDecayPointCalldata
    ]);
    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(
            ["address", "bytes", "uint32"],
            [opOwnerAddr, executeOpSetHalfDecay, gasLimit]
        )
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeOpSetHalfDecay, gasLimit])
    );

    // set max stake
    const maxStakeAmount = "50000000000000000000000";
    const opSetMaxStakeAmountCalldata = iface.encodeFunctionData("setMaxStakeAmount(uint96)", [maxStakeAmount]);
    const executeData = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opUserManagerAddr,
        0,
        opSetMaxStakeAmountCalldata
    ]);
    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddr, executeData, gasLimit])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeData, gasLimit])
    );

    const msg = `
UIP-016: Update Half Decay Point and Max Stake Parameters

# Abstract

- Set half decay point of the Mainnet Comptroller to 10,000.

- Set half decay point of the Arbitrum Comptroller to 1,000.

- Set half decay point of the Optimism Comptroller to 100,000.

- Raise the max stake on Optimism to 50,000 DAI.

# Specification

- Set the half decay point of the Ethereum Mainnet Comptroller to 10,000

- Set the half decay point of the Arbitrum Comptroller to 1,000

- Set the half decay point of the Optimism Comptroller to 100,000

- Raise the max stake on Optimism to 50,000 DAI.

# Test Cases

Tests and simulations can be found here: [PR](https://github.com/unioncredit/UIPs/pull/25)

# Implementation

For Mainnet:
- Call [Comptroller](https://etherscan.io/address/0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d).setHalfDecayPoint("10000") to set the half decay point to 10,000.

For Arbitrum:
- Call [Comptroller](https://arbiscan.io/address/0x641DD6258cb3E948121B10ee51594Dc2A8549fe1).setHalfDecayPoint("1000") to set the half decay point to 1,000.

For Optimism:
- Call [OpOwner](https://optimistic.etherscan.io/address/0x946A2C918F3D928B918C01D813644f27Bcd29D96).execute() to call [Comptroller](https://optimistic.etherscan.io/address/0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3).setHalfDecayPoint("100000") to set the half decay point to 100,000.
- Call [OpOwner](https://optimistic.etherscan.io/address/0x946A2C918F3D928B918C01D813644f27Bcd29D96).execute() to call [UserManager](https://optimistic.etherscan.io/address/0x8E195D65b9932185Fcc76dB5144534e0f3597628).setMaxStakeAmount("50000000000000000000000") to set max stake to 50,000 DAI.

    `;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
