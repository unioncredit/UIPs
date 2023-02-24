const {ethers, deployments, getChainId, network} = require("hardhat");
const {expect} = require("chai");
require("chai").should();

const {parseUnits} = ethers.utils;
const {waitNBlocks, increaseTime} = require("../../../utils");
const {getProposalParams} = require("../proposal.js");
const uTokenABI = require("../../../abis/UToken.json");
const interestRateModelABI = require("../../../abis/FixedInterestRateModel.json");

const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union

let defaultAccount, governor, unionToken, addresses;

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
    res.toString().should.eq("4"); // Vote succeeded

    console.log(`Queueing proposal Id: ${proposalId}`);

    await governor["queue(uint256)"](proposalId);

    await increaseTime(7 * 24 * 60 * 60);

    res = await governor.getActions(proposalId);
    console.log(res.toString());

    console.log(`Executing proposal Id: ${proposalId}`);

    await governor["execute(uint256)"](proposalId, {
        value: parseUnits("1")
    });
};

describe("Update overdueBlocks, and interestRate on Mainnet and Arbitrum", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 16695750
                    }
                }
            ]
        });

        [defaultAccount] = await ethers.getSigners();
        unionSigner = await ethers.getSigner(unionUser);

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [unionSigner.address]
        });

        // Send ETH to account
        await defaultAccount.sendTransaction({
            to: unionSigner.address,
            value: parseUnits("10")
        });

        addresses = require(`../addresses.js`)[await getChainId()];

        const UnionGovernorABI = require("../../../abis/UnionGovernor.json");
        const UnionTokenABI = require("../../../abis/UnionToken.json");

        governor = await ethers.getContractAt(UnionGovernorABI, addresses.governorAddress);
        unionToken = await ethers.getContractAt(UnionTokenABI, addresses.unionTokenAddress);
        await unionToken.connect(unionSigner).delegate(defaultAccount.address);
    });

    it("Submit proposal", async () => {
        console.log({addresses});

        const {targets, values, sigs, calldatas, msg} = await getProposalParams(addresses);

        await governor["propose(address[],uint256[],string[],bytes[],string)"](targets, values, sigs, calldatas, msg);
    });

    it("Cast votes", async () => {
        await voteProposal(governor);
    });

    it("Validate results", async () => {
        // can only verify results on Mainnet
        const uDai = await ethers.getContractAt(uTokenABI, addresses.uDaiAddr);
        (await uDai.overdueBlocks()).should.eq("216000");
        const interestRateModel = await ethers.getContractAt(interestRateModelABI, addresses.interestRateAddr);
        (await interestRateModel.getBorrowRate()).should.eq("38051750380");
    });
});
