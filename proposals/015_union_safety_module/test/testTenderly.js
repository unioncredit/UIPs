const {ethers, getChainId} = require("hardhat");
const {parseEther} = require("ethers").utils;
require("chai").should();
const axios = require("axios");
const {tenderlyWaitNBlocks, increaseTime} = require("../../../utils");
const {getProposalParams} = require("../proposal.js");

describe("Deploying Cozy Safety Module ...", () => {
    const startBlock = 19816861;
    const {TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY} = process.env;
    const account = "0x0fb99055fcdd69b711f6076be07b386aa2718bc6"; //An address with union

    let oldProvider, governor, unionToken;
    const deployAndInitContracts = async () => {
        axios.create({
            baseURL: "https://api.tenderly.co/api/v1",
            headers: {
                "X-Access-Key": TENDERLY_ACCESS_KEY || "",
                "Content-Type": "application/json"
            }
        });

        opts = {
            headers: {
                "X-Access-Key": TENDERLY_ACCESS_KEY
            }
        };

        const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`;
        const body = {
            network_id: "1",
            block_number: startBlock
        };

        const res = await axios.post(TENDERLY_FORK_API, body, opts);
        forkId = res.data.simulation_fork.id;
        console.log(`forkId: ${forkId}`);
        forkRPC = `https://rpc.tenderly.co/fork/${forkId}`;
        provider = new ethers.providers.JsonRpcProvider(forkRPC);
        oldProvider = ethers.provider;
        ethers.provider = provider;

        const result = await provider.send("tenderly_setBalance", [
            [account],
            //amount in wei will be added for all wallets
            ethers.utils.hexValue(ethers.utils.parseUnits("10", "ether").toHexString())
        ]);

        const signerBal = await provider.send("eth_getBalance", [account, "latest"]);

        console.log({signerBal});

        unionSigner = await ethers.provider.getSigner(account);

        console.log({unionSigner});

        // assetManagerSigner = await ethers.provider.getSigner(assetManager);
        const UnionGovernorABI = require("../../../abis/UnionGovernor.json");
        const UnionTokenABI = require("../../../abis/UnionToken.json");

        const {governorAddress, unionTokenAddress} = require(`../addresses.js`)[await getChainId()];

        governor = await ethers.getContractAt(UnionGovernorABI, governorAddress, unionSigner);
        unionToken = await ethers.getContractAt(UnionTokenABI, unionTokenAddress);
        const tx = await unionToken.connect(unionSigner).delegate(account);
        await tx.wait();
    };

    before(deployAndInitContracts);

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

        const tx = await governor["propose(address[],uint256[],string[],bytes[],string)"](
            targets,
            values,
            funcSigs,
            calldatas,
            msg
        );
        await tx.wait();
    });

    it("Cast votes", async () => {
        let res, tx;
        const proposalId = await governor.latestProposalIds(account);

        if (proposalId == 0) return;

        const votingDelay = await governor.votingDelay();
        await tenderlyWaitNBlocks(parseInt(votingDelay));

        await governor.castVote(proposalId, 1);
        await tenderlyWaitNBlocks(parseInt(await governor.votingPeriod()));

        console.log(`Queueing proposal Id: ${proposalId}`);

        tx = await governor["queue(uint256)"](proposalId);
        await tx.wait();

        await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);

        res = await governor.getActions(proposalId);
        console.log(res.toString());

        console.log(`Executing proposal Id: ${proposalId}`);

        tx = await governor["execute(uint256)"](proposalId);
        await tx.wait();
    });

    it("Validate results", async () => {
        const {unionSafetyModule} = require(`../addresses.js`)[await getChainId()];
        const SafetyModuleABI = require("../abis/SafetyModule.json");

        const unionSM = await ethers.getContractAt(SafetyModuleABI, unionSafetyModule);

        const {configUpdateDelay, configUpdateGracePeriod, withdrawDelay} = await unionSM.delays();
        configUpdateDelay.toString().should.eq("1814400");
        configUpdateGracePeriod.toString().should.eq("1814400");
        withdrawDelay.toString().should.eq("1209600");
    });

    it("delete fork", async function () {
        ethers.provider = oldProvider;
        const TENDERLY_FORK_ACCESS_URL = `https://api.tenderly.co/api/v1/account/${process.env.TENDERLY_USER}/project/${process.env.TENDERLY_PROJECT}/fork/${forkId}`;
        await axios.delete(TENDERLY_FORK_ACCESS_URL, opts);
    });
});
