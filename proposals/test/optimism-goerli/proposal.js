const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const opOwnerABI = require("../../../abis/OpOwner.json");
const fixedRateInterestModelABI = require("../../../abis/FixedRateInterestMode.json");

const optimismBridgeAddress = "0x5086d1eEF304eb5284A0f6720f79403b4e9bE294";
//test call l2 utoken setMaxBorrow from l1
async function getProposalParams({opOwnerAddress, fixedRateInterestModelL2}) {
    if (!fixedRateInterestModelL2 || !opOwnerAddress) {
        throw new Error("address error");
    }

    const fixedRateInterestModel = await ethers.getContractAt(fixedRateInterestModelABI, fixedRateInterestModelL2);
    const opOwner = await ethers.getContractAt(opOwnerABI, opOwnerAddress);
    const iface = new Interface([`function sendMessage(address,bytes,uint32) external`]);

    const data = fixedRateInterestModel.interface.encodeFunctionData("setInterestRate(uint256)", ["6341958397"]);
    const executeData = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        fixedRateInterestModelL2,
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
    Change the rate to 6341958397, which is 10% APR (6341958397 x 43200 (blocks per day) x 365)
`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
