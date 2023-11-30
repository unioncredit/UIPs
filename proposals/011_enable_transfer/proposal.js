const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const UnionTokenABI = require("../../abis/UnionToken.json");
const opOwnerABI = require("../../abis/OpOwner.json");
const arbProposeParams = require("../../utils/arbProposeParams.js");

const optimismBridgeAddress = "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1";
async function getProposalParams(addresses) {
    const {unionAddr, arbUnionAddr, opUnionAddr, opOwnerAddr} = addresses;
    console.log({unionAddr});

    if (!unionAddr) {
        throw new Error("address error");
    }

    //L1 address
    const excessFeeRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";
    const callValueRefundAddress = "0x7a0C61EdD8b5c0c5C1437AEb571d7DDbF8022Be4";

    const union = await ethers.getContractAt(UnionTokenABI, unionAddr);
    const latestBlock = await ethers.provider.getBlock("latest");
    console.log({latestBlock});

    const disableWhitelistCalldata = union.interface.encodeFunctionData("disableWhitelist()", []);

    // Actions for mainnet
    let targets = [union.address],
        values = ["0"],
        sigs = ["disableWhitelist()"],
        calldatas = [ethers.utils.defaultAbiCoder.encode([], [])],
        signedCalldatas = [disableWhitelistCalldata];

    // Update half decay point
    const arbUnion = await ethers.getContractAt(UnionTokenABI, arbUnionAddr);
    const arbDisableWhitelistCalldata = arbUnion.interface.encodeFunctionData("disableWhitelist()", []);
    // Actions for Arbitrum
    const actions = [[[], [], arbUnionAddr, "0", arbDisableWhitelistCalldata]];

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
    const opUnion = await ethers.getContractAt(UnionTokenABI, opUnionAddr);
    const opOwner = await ethers.getContractAt(opOwnerABI, opOwnerAddr);
    const iface = new Interface([`function sendMessage(address,bytes,uint32) external`]);

    const data = opUnion.interface.encodeFunctionData("disableWhitelist()", []);
    console.log({data});
    const executeData = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [opUnionAddr, 0, data]);
    console.log({executeData});
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

    const msg = `
    UIP-011: Enable Transferability of the UNION Token

    # Abstract
    
    - Disable the whitelist of the UNION token to enable the transferability on Mainnet, Arbitrum, and Optimism.
    
    # Specification
    
    - Enable the transferability on Mainnet by calling UnionToken.disableWhitelist().
    
    - Enable the transferability on Arbitrum by calling ArbUnion.disableWhitelist().
    
    - Enable transferability on Optimism by calling OpUnion.disableWhitelist().
    
    # Implementation
    
    
    For Mainnet:
    
    Call [UnionToken.disableWhitelist()](https://etherscan.io/address/0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C#writeContract) from the Timelock.
    
    For Arbitrum:
    
    Send cross-chain transaction to [ArbUnion.disableWhitelist()](https://arbiscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9#writeContract).
    
    For Optimism:
    
    Send cross-chain transaction to [OpUnion.disableWhitelist()](https://optimistic.etherscan.io/address/0xB025ee78b54B5348BD638Fe4a6D77Ec2F813f4f9#writeContract).
`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
