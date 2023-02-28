const {ethers, getChainId, network} = require("hardhat");
require("chai").should();
const {parseUnits} = ethers.utils;
const uTokenABI = require("../../../abis/UToken.json");
const interestRateModelABI = require("../../../abis/FixedInterestRateModel.json");

let defaultAccount, addresses;
describe("Update overdueBlocks, and interestRate on Arbitrum", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://arb-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 16695750
                    }
                }
            ]
        });
        addresses = require(`../addresses.js`)[await getChainId()];

        [defaultAccount] = await ethers.getSigners();
        timelockSigner = await ethers.getSigner(addresses.timelockAddrL2);

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [timelockSigner.address]
        });

        // Send ETH to account
        await defaultAccount.sendTransaction({
            to: timelockSigner.address,
            value: parseUnits("1")
        });
    });

    it("Mock execute and validate results on l2", async () => {
        const uDai = await ethers.getContractAt(uTokenABI, addresses.uDaiAddrL2);
        await uDai.connect(timelockSigner).setOverdueBlocks("216000");
        (await uDai.overdueBlocks()).should.eq("216000");

        const interestRateModel = await ethers.getContractAt(interestRateModelABI, addresses.interestRateAddrL2);
        await interestRateModel.connect(timelockSigner).setInterestRate("38051750380");
        (await interestRateModel.getBorrowRate()).should.eq("38051750380");
    });
});
