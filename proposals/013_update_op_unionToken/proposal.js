const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const OpOwnerABI = require("../../abis/OpOwner.json");
const TreasuryABI = require("../../abis/Treasury.json");

const optimismBridgeAddress = "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1";
async function getProposalParams(addresses) {
    const {
        treasuryAddr,
        newOpConnectorAddr,
        opOwnerAddr,
        opUserManagerAddr,
        opComptrollerAddr,
        newOpUnionAddr,
        newComptrollerLogic,
        newUserManagerLogic
    } = addresses;

    const treasury = await ethers.getContractAt(TreasuryABI, treasuryAddr);
    const latestBlock = await ethers.provider.getBlock("latest");
    console.log({latestBlock});
    const dripStart = latestBlock.number; // the current block number
    const dripRate = ethers.utils.parseEther("1"); // 1 UNION per block
    const target = newOpConnectorAddr;
    const amount = ethers.utils.parseEther("2628000"); // For 12 months, it's 31,536,000 seconds. Assuming a 12 second block, it'll be 2,628,000 UNION
    const addScheduleCalldata = treasury.interface.encodeFunctionData("addSchedule(uint256,uint256,address,uint256)", [
        dripStart,
        dripRate,
        target,
        amount
    ]);

    // Actions for mainnet
    let targets = [treasuryAddr],
        values = ["0"],
        sigs = ["addSchedule(uint256,uint256,address,uint256)"],
        calldatas = [
            ethers.utils.defaultAbiCoder.encode(
                ["uint256", "uint256", "address", "uint256"],
                [dripStart, dripRate, target, amount]
            )
        ],
        signedCalldatas = [addScheduleCalldata];

    // Actions for Optimism
    const opOwner = await ethers.getContractAt(OpOwnerABI, opOwnerAddr);
    const iface = new Interface([
        `function sendMessage(address,bytes,uint32) external`,
        "function changeUnionToken(address) external",
        "function upgradeToAndCall(address,bytes) external"
    ]);
    const data = iface.encodeFunctionData("changeUnionToken(address)", [newOpUnionAddr]);
    const compUpgradeData = iface.encodeFunctionData("upgradeToAndCall(address,bytes)", [newComptrollerLogic, data]);
    const userManagerUpgradeData = iface.encodeFunctionData("upgradeToAndCall(address,bytes)", [
        newUserManagerLogic,
        data
    ]);
    const executeData = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opComptrollerAddr,
        0,
        compUpgradeData
    ]);
    const executeData2 = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        opUserManagerAddr,
        0,
        userManagerUpgradeData
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

    targets.push(optimismBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddr, executeData2, gasLimit])
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddr, executeData2, gasLimit])
    );

    const msg = ``;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
