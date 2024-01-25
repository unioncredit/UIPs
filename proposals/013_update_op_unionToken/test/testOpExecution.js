const {ethers, getChainId, network} = require("hardhat");
require("chai").should();
const {parseUnits} = ethers.utils;
const OpOwnerABI = require("../../../abis/OpOwner.json");
const ComptrollerABI = require("../../../abis/Comptroller.json");
const UserManagerABI = require("../../../abis/UserManager.json");
const {Interface} = require("ethers/lib/utils");
const {deploy} = require("../deploy.js");

let defaultAccount, addresses, unionSigner, senderSigner;
const opAdmin = "0x652AbFA76d8Adf89560f110322FC63156C5aE5c8";
const unionUser = "0xb8150a1b6945e75d05769d685b127b41e6335bbc"; //An address with union on op
describe("Upgrade userManager, comptroller and change the UNION Token on Optimism", async () => {
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
        const deployedAddress = await deploy();
        addresses = Object.assign(addresses, deployedAddress);

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
        const opOwner = await ethers.getContractAt(OpOwnerABI, addresses.opOwnerAddr);
        const comptroller = await ethers.getContractAt(ComptrollerABI, addresses.opComptrollerAddr);
        const userManager = await ethers.getContractAt(UserManagerABI, addresses.opUserManagerAddr);
        const iface = new Interface([
            `function sendMessage(address,bytes,uint32) external`,
            "function changeUnionToken(address) external",
            "function upgradeToAndCall(address,bytes) external"
        ]);
        const data = iface.encodeFunctionData("changeUnionToken(address)", [addresses.newOpUnionAddr]);
        const comptrollerUpgradeData = iface.encodeFunctionData("upgradeToAndCall(address,bytes)", [
            addresses.newComptrollerLogic,
            data
        ]);
        const userManagerUpgradeData = iface.encodeFunctionData("upgradeToAndCall(address,bytes)", [
            addresses.newUserManagerLogic,
            data
        ]);
        await opOwner.connect(senderSigner).execute(addresses.opComptrollerAddr, 0, comptrollerUpgradeData);
        await opOwner.connect(senderSigner).execute(addresses.opUserManagerAddr, 0, userManagerUpgradeData);
        (await comptroller.unionToken()).should.eq(addresses.newOpUnionAddr);
        (await userManager.unionToken()).should.eq(addresses.newOpUnionAddr);
    });
});
