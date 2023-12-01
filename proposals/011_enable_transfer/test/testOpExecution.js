const {ethers, getChainId, network} = require("hardhat");
require("chai").should();
const {expect} = require("chai");
const {parseUnits} = ethers.utils;
const OpOwnerABI = require("../../../abis/OpOwner.json");
const UnionTokenABI = require("../../../abis/UnionToken.json");

let defaultAccount, addresses, unionSigner, senderSigner;
const opAdmin = "0x652AbFA76d8Adf89560f110322FC63156C5aE5c8";
const unionUser = "0xb8150a1b6945e75d05769d685b127b41e6335bbc"; //An address with union on op
describe("Enable Transferability of the UNION Token on Optimism", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://opt-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 105200000
                    }
                }
            ]
        });
        addresses = require(`../addresses.js`)[await getChainId()];

        [defaultAccount] = await ethers.getSigners();
        unionSigner = await ethers.getSigner(unionUser);
        senderSigner = await ethers.getSigner(opAdmin); //It is impossible to directly simulate ovmL2CrossDomainMessenger to initiate a call, so the admin call is simulated.
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [senderSigner.address]
        });
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [unionSigner.address]
        });

        // Send ETH to account
        await defaultAccount.sendTransaction({
            to: senderSigner.address,
            value: parseUnits("1")
        });
        await defaultAccount.sendTransaction({
            to: unionSigner.address,
            value: parseUnits("1")
        });
    });

    it("Mock execute and validate results on op", async () => {
        const opUnion = await ethers.getContractAt(UnionTokenABI, addresses.opUnionAddr);
        const opOwner = await ethers.getContractAt(OpOwnerABI, addresses.opOwnerAddr);
        const data = opUnion.interface.encodeFunctionData("disableWhitelist()", []);
        await opOwner.connect(senderSigner).execute(addresses.opUnionAddr, 0, data);
        const whitelistEnabled = await opUnion.whitelistEnabled();
        console.log({whitelistEnabled});
        whitelistEnabled.should.eq(false);
        await expect(opUnion.connect(unionSigner).transfer(defaultAccount.address, parseUnits("1")))
            .to.emit(opUnion, "Transfer")
            .withArgs(unionSigner.address, defaultAccount.address, parseUnits("1"));
    });
});
