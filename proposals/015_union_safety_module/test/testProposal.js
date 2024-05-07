const {ethers, deployments, getChainId, network} = require("hardhat");
const {expect} = require("chai");
require("chai").should();

const {parseUnits} = ethers.utils;
const {voteProposal} = require("../../../utils");
const {getProposalParams} = require("../proposal.js");
const UnionGovernorABI = require("../../../abis/UnionGovernor.json");
const UnionTokenABI = require("../../../abis/UnionToken.json");

const unionUser = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union

let defaultAccount, governor, unionToken, treasury, multisigWallet;

describe("Deploying Cozy Safety Module ...", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY
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

        const {governorAddress, unionTokenAddress} = require(`../addresses.js`)[await getChainId()];
        console.log({
            governorAddress,
            unionTokenAddress
        });

        governor = await ethers.getContractAt(UnionGovernorABI, governorAddress);
        unionToken = await ethers.getContractAt(UnionTokenABI, unionTokenAddress);
        await unionToken.connect(unionSigner).delegate(defaultAccount.address);
    });

    it("Submit proposal", async () => {
        const {
            cozyRouter,
            cozyMetadataRegistry,
            timelock,
            safetyModulePauser,
            reservePoolAsset,
            triggerPayoutHandler,
            unionTrigger,
            unionSafetyModule
        } = require(`../addresses.js`)[await getChainId()];
        const {targets, values, funcSigs, calldatas, msg} = await getProposalParams({
            cozyRouter,
            cozyMetadataRegistry,
            timelock,
            safetyModulePauser,
            reservePoolAsset,
            triggerPayoutHandler,
            unionTrigger,
            unionSafetyModule
        });

        await governor["propose(address[],uint256[],string[],bytes[],string)"](
            targets,
            values,
            funcSigs,
            calldatas,
            msg
        );
    });

    it("Cast votes", async () => {
        await voteProposal(governor, defaultAccount.address);
    });

    it("Validate results", async () => {
        const {unionSafetyModule} = require(`../addresses.js`)[await getChainId()];

        console.log({unionSafetyModule});

        const SafetyModuleABI = require("../abis/SafetyModule.json");

        const unionSM = await ethers.getContractAt(SafetyModuleABI, unionSafetyModule);

        const delays = await unionSM.delays();
        console.log({delays});
    });
});
