const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const OpOwnerABI = require("../../abis/OpOwner.json");
const ComptrollerABI = require("../../abis/Comptroller.json");
const arbProposeParams = require("../../utils/arbProposeParams.js");

async function getProposalParams(addresses) {
    const {opOwnerAddr, comptrollerAddr, arbComptrollerAddr, opUserManagerAddr, optimismBridgeAddress} = addresses;

    const comptroller = await ethers.getContractAt(ComptrollerABI, comptrollerAddr);
    const halfdecayPoint = 25000;
    const setHalfDecayPointCalldata = comptroller.interface.encodeFunctionData("setHalfDecayPoint(uint256)", [
        halfdecayPoint
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
        calldatas = [ethers.utils.defaultAbiCoder.encode(["uint256"], [halfdecayPoint])],
        signedCalldatas = [setHalfDecayPointCalldata];

    // Actions for Arbitrum
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const newHalfDecayPoint = 25000;
    const arbSetHalfDecayPointCalldata = iface.encodeFunctionData("setHalfDecayPoint(uint256)", [newHalfDecayPoint]);
    const actions = [[["uint256"], [newHalfDecayPoint], arbComptrollerAddr, "0", arbSetHalfDecayPointCalldata]];
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
    const maxStakeAmount = 25000;
    const opOwner = await ethers.getContractAt(OpOwnerABI, opOwnerAddr);
    const data = iface.encodeFunctionData("setMaxStakeAmount(uint96)", [maxStakeAmount]);
    const executeData = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opUserManagerAddr,
        0,
        data
    ]);
    const gasLimit = 2000000;
    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddr, executeData, gasLimit])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeData, gasLimit])
    );

    const msg = ``;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
