const {ethers} = require("hardhat");

async function getProposalParams(addresses) {
    const {treasuryAddress, baseConnectorAddress} = addresses;

    if (!treasuryAddress || !baseConnectorAddress) {
        throw new Error("address error");
    }

    const parseUnits = ethers.utils.parseUnits;

    const targets = [treasuryAddress];
    const values = ["0"];
    const currBlock = await ethers.provider.getBlock("latest");
    const sigs = ["addSchedule(uint256,uint256,address,uint256)"];
    const calldatas = [
        ethers.utils.defaultAbiCoder.encode(
            ["uint256", "uint256", "address", "uint256"],
            [
                currBlock.number, // drip start block
                parseUnits("1"), // drip rate, in wei
                baseConnectorAddress, // target address
                parseUnits("2400000") // 1 union per block for 1 year
            ]
        )
    ];

    const msg = `
UIP-017: Drip UNION to Base comptroller

## Abstract
In order to support Union on Base, UNION token will need to be distributed to participants. The L1 treasury will drip UNION token to the Base comptroller. An intermediary contract (BaseConnector) is added to connect L1 treasury to the Union Base comptroller.

## Motivation
Protocol participants will need to be able to claim UNION on the Base Network. Therefore, the Union protocol comptroller on the Base network needs to have UNION continuously dripped over.

## Specification
Add OpConnector contract to be a new dripping target of the Treasury, and set the dripping rate to be 1 UNION per block in a total amount of 2.4M UNION tokens, which will last for 1 year at the current Ethereum block minting rate (13.14 seconds per block)

## Rationale
Adding a treasury on L2 was considered, but there was no identifiable upside for going this route. Adding a comptroller provided the same benefits with lower effort.

## Backwards Compatibility
No issues with backwards compatibility for this proposal

## Test Cases
Tests and simulations can be found here: [Link to PR](https://github.com/unioncredit/union-v1-proposals/pull/9)

## Implementation
Call the function 'addSchedule(uint256,uint256,address,uint256)' of the Treasury contract ([0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9](https://etherscan.io/address/0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9#code)) with the following parameters:
- drip start block: the block when the proposal is created
- drip rate: 1 UNION per block
- target address: BaseConnector ([0x307ED81138cA91637E432DbaBaC6E3A42699032a](https://etherscan.io/address/0x307ED81138cA91637E432DbaBaC6E3A42699032a))
- total amount: 2.4M UNION
- PR link: https://github.com/unioncredit/union-v1-proposals/pull/9

## Security Considerations
- BaseConnector contract should work correctly to bridge any wrapped UNION on its balance to the Base comptroller.
- Any wrapped UNION in BaseConnector cannot be sent to any addresses other than the Base bridge.
- Wrapped UNION in BaseConnector can be withdrawn by the owner in case of emergency (by calling 'claimTokens(address recipient)')

`;
    const TreasuryABI = require("../../abis/Treasury.json");
    const iface = new ethers.utils.Interface(TreasuryABI);
    const signedCalldatas = [];

    signedCalldatas.push(
        iface.encodeFunctionData(sigs[0], [
            currBlock.number, // drip start block
            parseUnits("1"), // drip rate, in wei
            baseConnectorAddress, // target address
            parseUnits("2400000") // 1 union per block for 1 year
        ])
    );

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
