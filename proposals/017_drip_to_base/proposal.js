const {ethers} = require("hardhat");
const {Interface} = require("ethers/lib/utils");
const OpOwnerABI = require("../../abis/OpOwner.json");
const TreasuryABI = require("../../abis/Treasury.json");

async function getProposalParams(addresses) {
    const {treasuryAddress, baseConnectorAddress, baseOwnerAddr, baseComptrollerAddr, baseBridgeAddress} = addresses;

    if (!(treasuryAddress && baseConnectorAddress && baseOwnerAddr && baseComptrollerAddr && baseBridgeAddress)) {
        throw new Error("address error");
    }

    const parseUnits = ethers.utils.parseUnits;

    // For Mainnet

    const treasury = await ethers.getContractAt(TreasuryABI, treasuryAddress);

    const targets = [treasuryAddress];
    const values = ["0"];
    const currBlock = await ethers.provider.getBlock("latest");
    const sigs = ["addSchedule(uint256,uint256,address,uint256)"];
    const newScheduleParams = [
        currBlock.number, // drip start block
        parseUnits("1"), // drip rate, in wei
        baseConnectorAddress, // target address
        parseUnits("2628000") // 1 union per block for 1 year
    ];
    const calldatas = [
        ethers.utils.defaultAbiCoder.encode(["uint256", "uint256", "address", "uint256"], newScheduleParams)
    ];
    const signedCalldatas = [
        treasury.interface.encodeFunctionData("addSchedule(uint256,uint256,address,uint256)", newScheduleParams)
    ];

    // For Optimism

    const gasLimit = 2000000;

    const opOwner = await ethers.getContractAt(OpOwnerABI, baseOwnerAddr);

    // set half decay
    const iface = new Interface([
        "function sendMessage(address,bytes,uint32) external",
        "function setHalfDecayPoint(uint256) external"
    ]);

    const opHalfDecayPoint = 100000;
    const opSetHalfDecayPointCalldata = iface.encodeFunctionData("setHalfDecayPoint(uint256)", [opHalfDecayPoint]);
    const executeOpSetHalfDecay = opOwner.interface.encodeFunctionData("execute(address,uint256,bytes)", [
        baseComptrollerAddr,
        0,
        opSetHalfDecayPointCalldata
    ]);
    targets.push(baseBridgeAddress);
    values.push(gasLimit);
    sigs.push("sendMessage(address,bytes,uint32)");
    calldatas.push(
        ethers.utils.defaultAbiCoder.encode(
            ["address", "bytes", "uint32"],
            [baseOwnerAddr, executeOpSetHalfDecay, gasLimit]
        )
    );
    signedCalldatas.push(
        iface.encodeFunctionData("sendMessage(address,bytes,uint32)", [baseOwnerAddr, executeOpSetHalfDecay, gasLimit])
    );

    const msg = `
UIP-017: Drip UNION to Base comptroller

## Abstract
In order to support Union on Base, UNION token will need to be distributed to participants. The L1 treasury will drip UNION token to the Base comptroller. An intermediary contract (BaseConnector) is added to connect L1 treasury to the Union Base comptroller.

## Motivation
Protocol participants will need to be able to claim UNION on the Base Network. Therefore, the Union protocol comptroller on the Base network needs to have UNION continuously dripped over.

## Specification
- Set half decay point of the Optimism Comptroller to 100,000.
- Add OpConnector contract to be a new dripping target of the Treasury, and set the dripping rate to be 1 UNION per block in a total amount of 2,628,000 UNION tokens, which will last for one year at the current Ethereum block minting rate (12 seconds per block)

## Rationale
Adding a treasury on L2 was considered, but there was no identifiable upside for going this route. Adding a comptroller provided the same benefits with lower effort.

## Backwards Compatibility
No issues with backwards compatibility for this proposal

## Test Cases
Tests and simulations can be found here: [Link to PR](https://github.com/unioncredit/union-v1-proposals/pull/26)

## Implementation

On Mainnet

- Call [Treasury](https://etherscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9).addSchedule('uint256',uint256,address,uint256) with the following parameters:
    - drip start block: the block when the proposal is created
    - drip rate: 1 UNION per block
    - target address: [BaseConnector](https://etherscan.io/address/0x307ED81138cA91637E432DbaBaC6E3A42699032a)
    - total amount: 2,628,000

On Optimism:

- Call [OpOwner](https://basescan.org/address/0x20473Af81162B3E79F0333A2d8D64C88a71B88e8).execute() to call [Comptroller](https://basescan.org/address/0x37C092D275E48e3c9001059D9B7d55802CbDbE04).setHalfDecayPoint("100000") to set the half decay point to 100,000.
`;

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
