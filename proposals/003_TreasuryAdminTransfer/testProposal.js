const {ethers, deployments, getChainId} = require("hardhat");
const {parseUnits} = ethers.utils;
const {waitNBlocks, increaseTime} = require("../../utils");
const {getProposalParams} = require("./proposal.js");
require("chai").should();

const ethUser = "0x07f0eb0c571B6cFd90d17b5de2cc51112Fb95915"; //An address with eth
const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union

let defaultAccount, governorProxy, unionToken, treasuryAddress, timelockAddress;

const voteProposal = async governor => {
    let res;
    const proposalId = await governor.latestProposalIds(defaultAccount.address);

    const votingDelay = await governor.votingDelay();
    await waitNBlocks(parseInt(votingDelay) + 10);

    res = await governor.state(proposalId);
    res.toString().should.eq("1");

    await governor.castVote(proposalId, 1);
    const votingPeriod = await governor.votingPeriod();
    await waitNBlocks(parseInt(votingPeriod));

    res = await governor.state(proposalId);
    res.toString().should.eq("4");

    console.log(`Queueing proposal Id: ${proposalId}`);

    await governor["queue(uint256)"](proposalId);

    await increaseTime(7 * 24 * 60 * 60);

    res = await governor.getActions(proposalId);
    console.log(res.toString());

    console.log(`Executing proposal Id: ${proposalId}`);

    await governor["execute(uint256)"](proposalId);
};

describe("Transfer treasury's admin to Timelock", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 14305300
                    }
                }
            ]
        });
        [defaultAccount] = await ethers.getSigners();
        ethSigner = await ethers.getSigner(ethUser);
        unionSigner = await ethers.getSigner(unionUser);
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [ethSigner.address]
        });
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [unionSigner.address]
        });

        // Send ETH to account
        await ethSigner.sendTransaction({
            to: defaultAccount.address,
            value: parseUnits("10")
        });
        await ethSigner.sendTransaction({
            to: unionSigner.address,
            value: parseUnits("10")
        });

        const {
            governorAddress,
            unionTokenAddress,
            treasuryAddress: _treasuryAddress,
            timelockAddress: _timelockAddress
        } = require(`./addresses.js`)[await getChainId()];
        treasuryAddress = _treasuryAddress;
        timelockAddress = _timelockAddress;
        console.log({governorAddress, unionTokenAddress, treasuryAddress, timelockAddress});

        const UnionGovernorABI = require("../../abis/UnionGovernor.json");
        const UnionTokenABI = require("../../abis/UnionToken.json");

        governorProxy = await ethers.getContractAt(UnionGovernorABI, governorAddress);
        unionToken = await ethers.getContractAt(UnionTokenABI, unionTokenAddress);
        await unionToken.connect(unionSigner).delegate(defaultAccount.address);
    });

    it("Submit proposal", async () => {
        const {targets, values, sigs, calldatas, msg} = await getProposalParams({
            treasuryAddress
        });

        await governorProxy["propose(address[],uint256[],string[],bytes[],string)"](
            targets,
            values,
            sigs,
            calldatas,
            msg
        );
    });

    it("Cast votes", async () => {
        await voteProposal(governorProxy);
    });

    it("Validate results from new governor", async () => {
        const TreasuryABI = require("../../abis/Treasury.json");
        const treasury = await ethers.getContractAt(TreasuryABI, treasuryAddress);
        const newAdmin = await treasury.admin();
        newAdmin.should.eq(timelockAddress);
    });
});
