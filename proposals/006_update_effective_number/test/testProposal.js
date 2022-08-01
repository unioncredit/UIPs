const {ethers, deployments, getChainId, network} = require("hardhat");
const {expect} = require("chai");
require("chai").should();

const {parseUnits} = ethers.utils;
const {waitNBlocks, increaseTime} = require("../../../utils");
const {getProposalParams} = require("../proposal.js");
const sumOfTrustABI = require("../../../abis/SumOfTrust.json");

const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union

let defaultAccount, governor, unionToken;

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

    await governor["execute(uint256)"](proposalId, {
        value: "1000000000000000000"
    });
};

describe("Update effectiveNumber on Mainnet & Arbitrum", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 15133722
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

        const addresses = require(`../addresses.js`)[await getChainId()];
        governorAddress = addresses.governorAddress;
        sumOfTrustAddr = addresses.sumOfTrustAddr;
        sumOfTrustAddrL2 = addresses.sumOfTrustAddrL2;
        unionTokenAddress = addresses.unionTokenAddress;
        console.log({governorAddress, sumOfTrustAddr, sumOfTrustAddrL2, unionTokenAddress});

        const UnionGovernorABI = require("../../../abis/UnionGovernor.json");
        const UnionTokenABI = require("../../../abis/UnionToken.json");

        governor = await ethers.getContractAt(UnionGovernorABI, governorAddress);
        unionToken = await ethers.getContractAt(UnionTokenABI, unionTokenAddress);
        await unionToken.connect(unionSigner).delegate(defaultAccount.address);
    });

    it("Submit proposal", async () => {
        const {targets, values, sigs, calldatas, msg} = await getProposalParams({
            sumOfTrustAddr,
            sumOfTrustAddrL2
        });

        await governor["propose(address[],uint256[],string[],bytes[],string)"](targets, values, sigs, calldatas, msg);
    });

    it("Cast votes", async () => {
        await voteProposal(governor);
    });

    it("Validate results", async () => {
        // can only verify results on Mainnet
        const sumOfTrust = await ethers.getContractAt(sumOfTrustABI, sumOfTrustAddr);
        (await sumOfTrust.effectiveNumber()).should.eq(1);
    });
});
