const {ethers} = require("hardhat");

async function getProposalParams({treasuryAddress}) {
    if (!treasuryAddress) {
        throw new Error("address error");
    }

    const targets = [treasuryAddress];
    const values = ["0"];
    const sigs = ["acceptAdmin()"];
    const calldatas = [ethers.utils.defaultAbiCoder.encode([], [])];
    const msg = `
UIP-003: Transfer treasury's ownership to timelock

# Proposals

- Accept the Treasury admin update (changing to Timelock)

`;

    const TreasuryABI = require("../../abis/Treasury.json");
    const iface = new ethers.utils.Interface(TreasuryABI);
    const signedCalldatas = [];
    for (i = 0; i < sigs.length; i++) {
        console.log({sig: sigs[i], calldata: calldatas[i]});
        signedCalldatas.push(iface.encodeFunctionData(sigs[i], calldatas[i] == "0x" ? [] : calldatas[i]));
    }
    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
