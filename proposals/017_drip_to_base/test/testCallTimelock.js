const { ethers, getChainId, network } = require("hardhat");
require("chai").should();
const { parseUnits } = ethers.utils;
const { Interface } = require("ethers/lib/utils");
const { increaseTime } = require("../../../utils/index.js");

const TimelockABI = require("../../../abis/TimelockController.json");

let defaultAccount, addresses, senderSigner, propId, dripStartBlock, calldatas, targets, predecessor, salt;
const unionAdminSafe = "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8";
const timelockAddr = "0xBBD3321f377742c4b3fe458b270c2F271d3294D8"
const treasuryAddr = "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9"
const newBaseConnectorAddr = "0xB6a2cD094dD1aabCf02f4069155957d640eb41C7"
describe("Add drip for Base", async () => {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://eth-mainnet.g.alchemy.com/v2/" + process.env.ALCHEMY_API_KEY,
                        blockNumber: 21436680
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

    it("schedule()", async () => {
        const { baseConnectorAddress } = addresses;
        console.log({ baseConnectorAddress });

        const ifaceTreasury = new Interface(["function addSchedule(uint256,uint256,address,uint256) external", "function editSchedule(uint256,uint256,address,uint256) external"]);

        const currBlock = await ethers.provider.getBlock("latest");
        dripStartBlock = currBlock.number + 60 * 60 * 24 / 12; // use the block number when executed
        console.log({ dripStartBlock });
        targets = [treasuryAddr, treasuryAddr];
        calldatas = [
            ifaceTreasury.encodeFunctionData("editSchedule(uint256,uint256,address,uint256)",
                [dripStartBlock, parseUnits("0"), baseConnectorAddress, parseUnits("0")]),
            ifaceTreasury.encodeFunctionData("addSchedule(uint256,uint256,address,uint256)",
                [dripStartBlock, parseUnits("1"), newBaseConnectorAddr, parseUnits("2628000")])
        ];
        predecessor = ethers.constants.HashZero;
        salt = ethers.utils.formatBytes32String("0");

        console.log({ targets, calldatas, predecessor, salt });

        const timelock = await ethers.getContractAt(TimelockABI, timelockAddr);
        const tx = await timelock.connect(senderSigner).scheduleBatch(
            targets,
            [0, 0], // values
            calldatas,
            predecessor,
            salt,
            86400);
        // console.log({ tx });
        const result = await tx.wait();
        const events = result.events;
        // console.log({ events: result.events });
        console.log({ event: events[0].args });

        propId = events[0].args.id;
    });

    it("execute()", async () => {
        const oldBlock = await ethers.provider.getBlock("latest");
        // console.log({ oldBlock })

        await increaseTime(24 * 60 * 60);

        const newBlock = await ethers.provider.getBlock("latest");
        // console.log({ newBlock })

        const timelock = await ethers.getContractAt(TimelockABI, timelockAddr);

        const isReady = await timelock.isOperationReady(propId);
        console.log({ isReady });

        await timelock.connect(senderSigner).executeBatch(
            targets,
            [0, 0], // values
            calldatas,
            predecessor,
            salt
        );
    });
});
