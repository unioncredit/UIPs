const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const OpOwnerABI = require("../../abis/OpOwner.json");

async function getProposalParams(addresses) {
    const {
        opUserManagerAddr,
        opUTokenAddr,
        opComptrollerAddr,
        opOwnerAddr,
        baseUserManagerAddr,
        baseUTokenAddr,
        baseComptrollerAddr,
        baseOwnerAddr,
        optimismBridgeAddress,
        baseBridgeAddress
    } = addresses;

    const iface = new Interface([
        "function sendMessage(address,bytes,uint32) external",
        "function setHalfDecayPoint(uint256) external",
        "function setMaxStakeAmount(uint96) external",
        "function setMaxBorrow(uint256) external",
        "function setDebtCeiling(uint256) external"
    ]);

    let targets = [],
        values = [],
        sigs = [],
        calldatas = [],
        signedCalldatas = [];

    // Actions for Optimism
    const opOwner = await ethers.getContractAt(OpOwnerABI, opOwnerAddr);
    const opMaxStakeAmount = "1000000000000000000000000"; //1m
    const opMaxBorrow = "101000000000000000000000"; //101k
    const opDebtCeiling = "1000000000000000000000000"; //1m
    const opHalfDecayPoint = "50000"; //50k
    const executeData1 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opUserManagerAddr,
        0,
        iface.encodeFunctionData("setMaxStakeAmount(uint96)", [opMaxStakeAmount])
    ]);
    const executeData2 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opUTokenAddr,
        0,
        iface.encodeFunctionData("setMaxBorrow(uint256)", [opMaxBorrow])
    ]);
    const executeData3 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opUTokenAddr,
        0,
        iface.encodeFunctionData("setDebtCeiling(uint256)", [opDebtCeiling])
    ]);
    const executeData4 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opComptrollerAddr,
        0,
        iface.encodeFunctionData("setHalfDecayPoint(uint256)", [opHalfDecayPoint])
    ]);
    const gasLimit = 2000000;
    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddr, executeData1, gasLimit])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeData1, gasLimit])
    );

    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddr, executeData2, gasLimit])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeData2, gasLimit])
    );

    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddr, executeData3, gasLimit])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeData3, gasLimit])
    );

    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddr, executeData4, gasLimit])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeData4, gasLimit])
    );

    // Actions for Base
    const gasLimit2 = 2000000;
    const baseOwner = await ethers.getContractAt(OpOwnerABI, baseOwnerAddr);

    const baseMaxStakeAmount = "1000000000000"; //1m
    const baseMaxBorrow = "101000000000"; //101k
    const baseDebtCeiling = "1000000000000"; //1m
    const baseHalfDecayPoint = "50000"; //50k

    const executeData5 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        baseUserManagerAddr,
        0,
        iface.encodeFunctionData("setMaxStakeAmount(uint96)", [baseMaxStakeAmount])
    ]);
    const executeData6 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        baseUTokenAddr,
        0,
        iface.encodeFunctionData("setMaxBorrow(uint256)", [baseMaxBorrow])
    ]);
    const executeData7 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        baseUTokenAddr,
        0,
        iface.encodeFunctionData("setDebtCeiling(uint256)", [baseDebtCeiling])
    ]);
    const executeData8 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        baseComptrollerAddr,
        0,
        iface.encodeFunctionData("setHalfDecayPoint(uint256)", [baseHalfDecayPoint])
    ]);

    targets.push(baseBridgeAddress);
    values.push(gasLimit2);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [baseOwnerAddr, executeData5, gasLimit2])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [baseOwnerAddr, executeData5, gasLimit2])
    );

    targets.push(baseBridgeAddress);
    values.push(gasLimit2);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [baseOwnerAddr, executeData6, gasLimit2])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [baseOwnerAddr, executeData6, gasLimit2])
    );

    targets.push(baseBridgeAddress);
    values.push(gasLimit2);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [baseOwnerAddr, executeData7, gasLimit2])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [baseOwnerAddr, executeData7, gasLimit2])
    );

    targets.push(baseBridgeAddress);
    values.push(gasLimit2);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [baseOwnerAddr, executeData8, gasLimit2])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [baseOwnerAddr, executeData8, gasLimit2])
    );

    const msg = `
UIP-018: raise the stake limit on base and optimism

# Abstract

- Chains: 0P and BASE

- maxStake $1M 

- max borrow $101k

- global debt limit 1M

- half-decay point: $50k
    `;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
