const {ethers} = require("hardhat");

async function getProposalParams({treasuryAddress, multisigWallet}) {
    if (!treasuryAddress || !multisigWallet) {
        throw new Error("address error");
    }

    const parseUnits = ethers.utils.parseUnits;

    const targets = [treasuryAddress];
    const values = ["0"];
    const sigs = ["grantToken(address,uint256)"];
    const params = [
        multisigWallet, // target address
        parseUnits("900000") // 900,000 union tokens
    ];

    const calldatas = [ethers.utils.defaultAbiCoder.encode(["address", "uint256"], params)];

    const msg = `
UIP-014: Recognized Delegate Program

# Abstract

We propose implementing a recognized delegate program to distribute UNION tokens to active delegates and those who delegate. 

# Specification

- Invoke the Treasury.grantToken() function to send 900,000 Union tokens to the [multisig wallet](https://etherscan.io/address/0xB869146C2d215B359E875aab583dA3F54440f278).

# Test Cases

Tests and simulations can be found here: [PR](https://github.com/unioncredit/UIPs/pull/23)

# Implementation

Call Treasury.grantToken() to send 900,000 Union tokens to the [multisig wallet](https://etherscan.io/address/0xB869146C2d215B359E875aab583dA3F54440f278).
`;
    const TreasuryABI = require("../../abis/Treasury.json");
    const iface = new ethers.utils.Interface(TreasuryABI);
    const signedCalldatas = [];

    signedCalldatas.push(iface.encodeFunctionData(sigs[0], params));

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
