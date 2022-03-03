const {ethers, getChainId, getNamedAccounts} = require("hardhat");

(async () => {
    const {deployer} = await getNamedAccounts();
    const {getProposalParams} = require(`./proposal.js`);
    const chainId = await getChainId();
    const {governorAddress, treasuryAddress} = require(`./addresses.js`)[chainId];
    console.log({governorAddress, treasuryAddress});

    const UnionGovernorABI = require("../../abis/UnionGovernor.json");
    const governor = await ethers.getContractAt(UnionGovernorABI, governorAddress);
    console.log({governor: governor.address});

    const latestProposalId = await governor.latestProposalIds(deployer);
    if (latestProposalId != 0) {
        const proposersLatestProposalState = await governor.state(latestProposalId);
        if (proposersLatestProposalState == 1) {
            throw new Error("found an already active proposal");
        } else if (proposersLatestProposalState == 0) {
            throw new Error("found an already pending proposal");
        }
    }

    const {targets, values, sigs, calldatas, msg} = await getProposalParams({
        treasuryAddress
    });

    await governor["propose(address[],uint256[],string[],bytes[],string)"](targets, values, sigs, calldatas, msg);
})();
