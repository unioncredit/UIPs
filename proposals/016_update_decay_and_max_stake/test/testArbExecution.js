const {ethers, getChainId, network} = require("hardhat");
require("chai").should();
const {parseUnits} = ethers.utils;
const ComptrollerABI = require("../../../abis/Comptroller.json");

let defaultAccount, addresses;
describe("Update half decay on Arbitrum", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://arb-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 175986720
                    }
                }
            ]
        });
        addresses = require(`../addresses.js`)[await getChainId()];

        [defaultAccount] = await ethers.getSigners();
        timelockSigner = await ethers.getSigner(addresses.arbTimelockAddr);

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

    it("Mock execute and validate results on arb", async () => {
        const comptroller = await ethers.getContractAt(ComptrollerABI, addresses.arbComptrollerAddr);
        const newHalfDecayPoint = 1000;
        await comptroller.connect(timelockSigner).setHalfDecayPoint(newHalfDecayPoint);
        (await comptroller.halfDecayPoint()).should.eq(newHalfDecayPoint);
    });
});
