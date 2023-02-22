const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const opOwnerABI = require("../../../abis/OpOwner.json");
const uTokenABI = require("../../../abis/uToken.json");

const optimismBridgeAddress = "0x5086d1eEF304eb5284A0f6720f79403b4e9bE294";
//test call l2 utoken setMaxBorrow from l1
async function getProposalParams({opOwnerAddress, uTokenAddressL2}) {
    if (!uTokenAddressL2 || !opOwnerAddress) {
        throw new Error("address error");
    }

    const uToken = await ethers.getContractAt(uTokenABI, uTokenAddressL2);
    const opOwner = await ethers.getContractAt(opOwnerABI, opOwnerAddress);
    const iface = new Interface([`function sendMessage(address,bytes,uint32) external`]);

    const data = uToken.interface.encodeFunctionData("setMaxBorrow(uint256)", ["99900000000000000000000"]);
    const executeData = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        uTokenAddressL2,
        0,
        data
    ]);
    const gasLimit = 2000000;

    const targets = [optimismBridgeAddress];
    const values = [gasLimit];
    const sigs = ["sendMessage(address,bytes,uint32)"];
    const calldatas = [
        ethers.utils.defaultAbiCoder.encode(["address", "bytes", "uint32"], [opOwnerAddress, executeData, gasLimit])
    ];
    const signedCalldatas = [
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [opOwnerAddress, executeData, gasLimit])
    ];
    const msg = `
Test: set utoken MaxBorrow to 99900
`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
