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
    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, msg});

    return {targets, values, sigs, calldatas, msg};
}

module.exports = {
    getProposalParams
};
