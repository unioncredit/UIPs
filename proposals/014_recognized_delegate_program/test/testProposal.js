const {ethers, deployments, getChainId, network} = require("hardhat");
const {expect} = require("chai");
require("chai").should();

const {parseUnits} = ethers.utils;
const {voteProposal} = require("../../../utils");
const {getProposalParams} = require("../proposal.js");
const UnionGovernorABI = require("../../../abis/UnionGovernor.json");
const UnionTokenABI = require("../../../abis/UnionToken.json");
const TreasuryABI = require("../../../abis/Treasury.json");

const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union

let defaultAccount, governor, unionToken, treasury, multisigWallet;

describe("Send UNION tokens to the multisig wallet", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 19125000
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

        const {
            governorAddress,
            unionTokenAddress,
            treasuryAddress,
            multisigWallet: _multisigWallet
        } = require(`../addresses.js`)[await getChainId()];
        multisigWallet = _multisigWallet;
        console.log({governorAddress, unionTokenAddress, treasuryAddress, multisigWallet});

        governor = await ethers.getContractAt(UnionGovernorABI, governorAddress);
        unionToken = await ethers.getContractAt(UnionTokenABI, unionTokenAddress);
        await unionToken.connect(unionSigner).delegate(defaultAccount.address);

        treasury = await ethers.getContractAt(TreasuryABI, treasuryAddress);
    });

    it("Submit proposal", async () => {
        const {targets, values, sigs, calldatas, msg} = await getProposalParams({
            treasuryAddress: treasury.address,
            multisigWallet
        });

        await governor["propose(address[],uint256[],string[],bytes[],string)"](targets, values, sigs, calldatas, msg);
    });

    it("Cast votes", async () => {
        await voteProposal(governor, defaultAccount.address);
    });

    it("Validate results", async () => {
        const bal = await unionToken.balanceOf(multisigWallet);
        bal.should.eq(parseUnits("900000"));
    });
});
