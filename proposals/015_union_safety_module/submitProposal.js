const {ethers, getChainId, getNamedAccounts} = require("hardhat");

(async () => {
    const {deployer} = await getNamedAccounts();
    const {getProposalParams} = require(`./proposal.js`);
    const chainId = await getChainId();
    console.log({chainId});
    const addresses = require(`./addresses.js`)[await getChainId()];
    console.log({addresses});

    const UnionGovernorABI = require("../../abis/UnionGovernor.json");
    const governor = await ethers.getContractAt(UnionGovernorABI, addresses.governorAddress);
    console.log({governor: governor.address});

    const latestProposalId = await governor.latestProposalIds(deployer);
    if (latestProposalId != 0) {
        const proposersLatestProposalState = await governor.state(latestProposalId);
        if (proposersLatestProposalState == 1) {
            throw new Error("Proposer already has an active proposal");
        } else if (proposersLatestProposalState == 0) {
            throw new Error("Proposer already has a pending proposal");
        }
    }

    const {targets, values, funcSigs, calldatas, signedCalldatas, msg} = await getProposalParams(addresses);

    let myBuffer = [];
    let buffer = new Buffer.from(msg);

    for (let i = 0; i < buffer.length; i++) {
        myBuffer.push(buffer[i]);
    }

    const proposalId = await governor["hashProposal(address[],uint256[],bytes[],bytes32)"](
        targets,
        values,
        signedCalldatas,
        ethers.utils.keccak256(myBuffer)
    );

    const deadline = await governor.proposalSnapshot(proposalId);
    if (deadline > 0) {
        throw new Error("Duplicated proposals");
    }
    await governor["propose(address[],uint256[],string[],bytes[],string)"](targets, values, funcSigs, calldatas, msg);
})();
