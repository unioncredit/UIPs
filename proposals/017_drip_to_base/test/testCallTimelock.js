const { ethers, getChainId, network } = require("hardhat");
require("chai").should();
const { parseUnits, formatBytes32String } = ethers.utils;
const { Interface } = require("ethers/lib/utils");
const { increaseTime } = require("../../../utils/index.js");

const TimelockABI = require("../../../abis/TimelockController.json");

let defaultAccount, addresses, senderSigner, propId;
const unionAdminSafe = "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8";
const timelockAddr = "0xBBD3321f377742c4b3fe458b270c2F271d3294D8"
const treasuryAddr = "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9"
describe("Add drip for Base", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 21435601
                    }
                }
            ]
        });
        addresses = require(`../addresses.js`)[await getChainId()];

        [defaultAccount] = await ethers.getSigners();
        //It is impossible to directly simulate cross-chain calls, so just sim from the admin account
        senderSigner = await ethers.getSigner(unionAdminSafe);
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

    it("Simulate schedule()", async () => {
        const { baseComptrollerAddr } = addresses;
        // console.log({ baseComptrollerAddr });

        const ifaceTreasury = new Interface(["function addSchedule(uint256,uint256,address,uint256) external"]);

        const currBlock = await ethers.provider.getBlock("latest");
        const calldatas = ifaceTreasury.encodeFunctionData("addSchedule(uint256,uint256,address,uint256)",
            [currBlock.timestamp, parseUnits("1"), baseComptrollerAddr, parseUnits("2628000")]);

        const timelock = await ethers.getContractAt(TimelockABI, timelockAddr);
        const tx = await timelock.connect(senderSigner).schedule(treasuryAddr, 0, calldatas, formatBytes32String("0"), formatBytes32String("1"), 86400);
        console.log({ tx });
        const result = await tx.wait();
        const events = result.events;
        console.log({ events: result.events });
        console.log({ event: events[0].args });

        propId = events[0].args.id;

        // console.log({ currHalfDecayPoint });
        // await baseOwner.connect(senderSigner).execute(baseComptrollerAddr, 0, setHalfDecayPointCalldata);
    });

    it("Simulate execute()", async () => {
        const { baseComptrollerAddr } = addresses;
        console.log({ baseComptrollerAddr });

        const ifaceTreasury = new Interface(["function addSchedule(uint256,uint256,address,uint256) external"]);

        const calldatas = ifaceTreasury.encodeFunctionData("addSchedule(uint256,uint256,address,uint256)",
            [(await ethers.provider.getBlock("latest")).timestamp, parseUnits("1"), baseComptrollerAddr, parseUnits("2628000")]);

        const oldBlock = await ethers.provider.getBlock("latest");
        // console.log({ oldBlock })

        await increaseTime(24 * 60 * 60);

        const newBlock = await ethers.provider.getBlock("latest");
        // console.log({ newBlock })

        const timelock = await ethers.getContractAt(TimelockABI, timelockAddr);

        const isReady = await timelock.isOperationReady(propId);
        console.log({ isReady });

        await timelock.connect(senderSigner).execute(treasuryAddr, 0, calldatas, formatBytes32String("0"), formatBytes32String("1"));
    });
});
