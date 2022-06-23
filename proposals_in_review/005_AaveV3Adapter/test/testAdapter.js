const {ethers, getChainId} = require("hardhat");
const {parseEther} = require("ethers").utils;
require("chai").should();
const axios = require("axios");
const {tenderlyWaitNBlocks} = require("../../../utils");

describe("Test aave3 adapter on forking arbitrum", () => {
    const startBlock = 15359634;
    const {TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY} = process.env;
    const daiAddress = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1";
    const account = "0x4a2328a2c7ffc1ea1a6ba4623dfc28029aa2b3ce"; //An address with eth and dai on the arbitrum is used for testing
    const assetManager = "0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275"; // on the arbitrum
    const adapterAddress = "0x393d7299c2caA940b777b014a094C3B2ea45ee2B";
    let oldProvider;
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
            network_id: "42161",
            block_number: startBlock
        };

        const res = await axios.post(TENDERLY_FORK_API, body, opts);
        forkId = res.data.simulation_fork.id;
        console.log(`forkId: ${forkId}`);
        forkRPC = `https://rpc.tenderly.co/fork/${forkId}`;
        provider = new ethers.providers.JsonRpcProvider(forkRPC);
        oldProvider = ethers.provider;
        ethers.provider = provider;

        signer = await ethers.provider.getSigner(account);
        assetManagerSigner = await ethers.provider.getSigner(assetManager);

        const AaveV3AdapterABI = require("../../../abis/AaveV3Adapter.json");
        const FaucetERC20ABI = require("../../../abis/FaucetERC20.json");

        dai = await ethers.getContractAt(FaucetERC20ABI, daiAddress);
        aAdapter = await ethers.getContractAt(AaveV3AdapterABI, adapterAddress);
    };

    before(deployAndInitContracts);

    it("deposit to aave and generate interest", async () => {
        const depositAmount = parseEther("0.1");
        console.log("transfer dai");
        await dai.connect(signer).transfer(aAdapter.address, depositAmount);
        console.log("deposit");
        await aAdapter.connect(signer).deposit(daiAddress);
        console.log("getSupplyView");
        const res = await aAdapter.getRate(daiAddress);
        console.log(res);
        let bal = await aAdapter.getSupplyView(daiAddress);
        console.log("start balance:", bal.toString());
        bal.should.be.above(depositAmount);

        await tenderlyWaitNBlocks(10);

        bal = await aAdapter.getSupplyView(daiAddress);
        console.log("after 10 blocks:", bal.toString());
        bal.should.be.above(depositAmount);

        console.log("withdrawAll");
        await aAdapter.connect(assetManagerSigner).withdrawAll(daiAddress, account);
        bal = await aAdapter.getSupplyView(daiAddress);
        console.log("after withdraw all:", bal.toString());
        bal.should.eq("0");
    });

    it("claim rewards", async () => {
        await aAdapter.connect(assetManagerSigner).claimRewards(daiAddress);
    });

    it("delete fork", async function () {
        ethers.provider = oldProvider;
        const TENDERLY_FORK_ACCESS_URL = `https://api.tenderly.co/api/v1/account/${process.env.TENDERLY_USER}/project/${process.env.TENDERLY_PROJECT}/fork/${forkId}`;
        await axios.delete(TENDERLY_FORK_ACCESS_URL, opts);
    });
});
