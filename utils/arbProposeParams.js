const hre = require("hardhat");
const {ethers, getChainId} = hre;
const {L1ToL2MessageGasEstimator} = require("@arbitrum/sdk/dist/lib/message/L1ToL2MessageGasEstimator");
const {hexDataLength} = require("@ethersproject/bytes");
require("dotenv").config();

const networks = {
    1: "mainnet",
    31337: "hardhat"
};

const encodeParameters = (types, values) => {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
};

async function main(types, params, destAddr, value, data, excessFeeRefundAddress, callValueRefundAddress) {
    const chainId = await getChainId();
    if (!networks[chainId]) {
        throw new Error("network not support");
    }

    let l1Provider, l2Provider, inboxAddress;
    if (chainId == 1) {
        l1Provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/" + process.env.INFURA_ID);
        l2Provider = new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
        inboxAddress = "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f";
    } else if (chainId == 31337) {
        // for simulations
        inboxAddress = "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f";
    }

    const newGreetingBytes = encodeParameters(types, params);
    const bytesLength = hexDataLength(newGreetingBytes) + 4;
    console.log(`bytesLength:${bytesLength}`);

    const maxGas = 275000;
    let submissionPriceWei, gasPriceBid;
    if (chainId != 31337) {
        const l1ToL2MessageGasEstimate = new L1ToL2MessageGasEstimator(l2Provider);
        const _submissionPriceWei = await l1ToL2MessageGasEstimate.estimateSubmissionFee(
            l1Provider,
            await l1Provider.getGasPrice(),
            bytesLength
        );
        console.log(`_submissionPriceWei:${_submissionPriceWei}`);
        submissionPriceWei = _submissionPriceWei.mul(5);
        gasPriceBid = await l2Provider.getGasPrice();
    } else {
        submissionPriceWei = ethers.BigNumber.from("100000000000000");
        gasPriceBid = ethers.BigNumber.from("5000000000");
    }
    const callValue = submissionPriceWei.add(gasPriceBid.mul(maxGas));
    const target = inboxAddress;
    const signature = "createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)";
    const l2CallValue = value;
    const maxSubmissionCost = submissionPriceWei;
    console.log({
        gasPriceBid: gasPriceBid.toString(),
        submissionPriceWei: submissionPriceWei.toString(),
        callValue: callValue.toString()
    });

    const calldata = encodeParameters(
        ["address", "uint256", "uint256", "address", "address", "uint256", "uint256", "bytes"],
        [
            destAddr,
            l2CallValue,
            maxSubmissionCost,
            excessFeeRefundAddress,
            callValueRefundAddress,
            maxGas,
            gasPriceBid,
            data
        ]
    );

    const ABI = ["function createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)"];
    const iface = new ethers.utils.Interface(ABI);
    const signCalldata = iface.encodeFunctionData("createRetryableTicket", [
        destAddr,
        l2CallValue,
        maxSubmissionCost,
        excessFeeRefundAddress,
        callValueRefundAddress,
        maxGas,
        gasPriceBid,
        data
    ]);
    return {target, value: callValue.toString(), signature, calldata, signCalldata};
}

module.exports = main;
