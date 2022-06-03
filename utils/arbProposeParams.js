const hre = require("hardhat");
const {ethers, getChainId} = hre;
const {Bridge} = require("arb-ts");
const {hexDataLength} = require("@ethersproject/bytes");
require("dotenv").config();

const networks = {
    1: "mainnet",
    31337: "hardhat"
};

const maxGas = 275000;

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
        l2Provider = new ethers.providers.JsonRpcProvider("https://mainnet.arbitrum.io/rpc");
        inboxAddress = "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f";
    } else if (chainId == 4) {
        l1Provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/" + process.env.INFURA_ID);
        l2Provider = new ethers.providers.JsonRpcProvider("https://rinkeby.arbitrum.io/rpc");
        inboxAddress = "0x578bade599406a8fe3d24fd7f7211c0911f5b29e";
    } else if (chainId == 31337) {
        l1Provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/" + process.env.INFURA_ID);
        l2Provider = new ethers.providers.JsonRpcProvider("https://mainnet.arbitrum.io/rpc");
        inboxAddress = "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f";
    }

    let gasPriceBid, submissionPriceWei;
    if (chainId != 31337) {
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY);
        const l1Signer = signer.connect(l1Provider);
        const l2Signer = signer.connect(l2Provider);
        const bridge = await Bridge.init(l1Signer, l2Signer);
        const newGreetingBytes = encodeParameters(types, params);
        const newGreetingBytesLength = hexDataLength(newGreetingBytes) + 4;
        const [_submissionPriceWei] = await bridge.l2Bridge.getTxnSubmissionPrice(newGreetingBytesLength);
        submissionPriceWei = _submissionPriceWei.mul(5);

        gasPriceBid = await bridge.l2Provider.getGasPrice();
        gasPriceBid = gasPriceBid.mul(ethers.BigNumber.from("2"));
    } else {
        submissionPriceWei = ethers.BigNumber.from("100000000000000");
        gasPriceBid = ethers.BigNumber.from("5000000000");
    }

    const callValue = submissionPriceWei.add(gasPriceBid.mul(maxGas));
    const target = inboxAddress;
    const signature = "createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)";
    const l2CallValue = value;
    const maxSubmissionCost = submissionPriceWei;

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
