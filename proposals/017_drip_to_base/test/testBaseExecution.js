const {ethers, getChainId, network} = require("hardhat");
require("chai").should();
const {parseUnits} = ethers.utils;
const {Interface} = require("ethers/lib/utils");
const OpOwnerABI = require("../../../abis/OpOwner.json");
const UserManagerABI = require("../../../abis/UserManager.json");
const ComptrollerABI = require("../../../abis/Comptroller.json");

let defaultAccount, addresses, senderSigner;
const baseAdmin = "0x567e418D831969142b52228b65a88f894e2D79a8";
describe("Set halfDecay on Base", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://base-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 22920144
                    }
                }
            ]
        });
        addresses = require(`../addresses.js`)[await getChainId()];

        [defaultAccount] = await ethers.getSigners();
        //It is impossible to directly simulate cross-chain calls, so just sim from the admin account
        senderSigner = await ethers.getSigner(baseAdmin);
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [senderSigner.address]
        });

        // Send ETH to account
        await defaultAccount.sendTransaction({
            to: senderSigner.address,
            value: parseUnits("1")
        });
    });

    it("Simulate and validate results", async () => {
        const {baseOwnerAddr, baseComptrollerAddr} = addresses;
        console.log({baseOwnerAddr, baseComptrollerAddr});

        const baseOwner = await ethers.getContractAt(OpOwnerABI, baseOwnerAddr);
        const iface = new Interface(["function setHalfDecayPoint(uint256) external"]);

        const halfDecayPoint = "100000";
        const setHalfDecayPointCalldata = iface.encodeFunctionData("setHalfDecayPoint(uint256)", [halfDecayPoint]);

        console.log({setHalfDecayPointCalldata});
        console.log({senderSigner: senderSigner.address});

        const comptroller = await ethers.getContractAt(ComptrollerABI, baseComptrollerAddr);

        const currHalfDecayPoint = await comptroller.halfDecayPoint();
        console.log({currHalfDecayPoint});
        await baseOwner.connect(senderSigner).execute(baseComptrollerAddr, 0, setHalfDecayPointCalldata);

        (await comptroller.halfDecayPoint()).should.eq(halfDecayPoint);
    });
});
