const {ethers} = require("hardhat");

async function getProposalParams({
    cozyRouter,
    cozyMetadataRegistry,
    timelock,
    safetyModulePauser,
    reservePoolAsset,
    triggerPayoutHandler,
    unionTrigger,
    unionSafetyModule
}) {
    console.log({
        cozyRouter,
        cozyMetadataRegistry,
        timelock,
        safetyModulePauser,
        reservePoolAsset,
        triggerPayoutHandler,
        unionTrigger,
        unionSafetyModule
    });

    const targets = [cozyRouter, cozyRouter, cozyRouter];
    const values = ["0", "0", "0"];
    const funcSigs = [
        "deployOwnableTrigger(address,(string,string,string,string),bytes32)",
        "deploySafetyModule(address,address,((uint256,address)[],(address,address,bool)[],(uint64,uint64,uint64)),bytes32)",
        "updateSafetyModuleMetadata(address,address,(string,string,string,string))"
    ];
    const funcParams = [
        [
            timelock, // trigger owner
            ["", "", "", ""], // trigger metadata
            "0x0100000000000000000000000000000000000000000000000000000000000000" // trigger salt
        ],
        [
            timelock, // safety module owner
            safetyModulePauser, // safety module pauser
            [
                [
                    [
                        3000, // reserve pool max slash percentage
                        reservePoolAsset // reserve pool assets
                    ]
                ],
                [
                    [
                        unionTrigger, // trigger address
                        triggerPayoutHandler, // trigger payout handler
                        true // exists
                    ]
                ],
                [
                    "1814400", // update delay
                    "1814400", // update grace oeriod
                    "1209600" // withdraw delay
                ]
            ],
            "0x0100000000000000000000000000000000000000000000000000000000000000" // safety module salt
        ],
        [
            cozyMetadataRegistry, // target address
            unionSafetyModule, // target address
            [
                "Union Safety Module", // name
                "This safety module protects Union users against significant hacks, bugs, or malfeasance.", // description
                "https://assets.coingecko.com/coins/images/30556/standard/Mark.png", // logoURI
                '{"protectionCapAmountUsd":"","shortfallDistributionMethod":"Prorata"}' // extraData
            ]
        ]
    ];

    const calldatas = [
        ethers.utils.defaultAbiCoder.encode(["address", "(string,string,string,string)", "bytes32"], funcParams[0]),
        ethers.utils.defaultAbiCoder.encode(
            ["address", "address", "((uint256,address)[],(address,address,bool)[],(uint64,uint64,uint64))", "bytes32"],
            funcParams[1]
        ),
        ethers.utils.defaultAbiCoder.encode(["address", "address", "(string,string,string,string)"], funcParams[2])
    ];

    const msg = `
UIP-015: Union Safety Module

# Abstract


# Specification

- Deploying the Union Safety Module requires 3 transactions to the CozyRouter contract (0xC58F8634E085243CC661b1623B3bC3224D80B439)

1. Deploying the governance-controlled trigger contract
1. Deploying the Safety Module
1. Update the Safety Module metadata

# Test Cases

Tests and simulations can be found [here](https://github.com/unioncredit/UIPs/pull/24)

# Implementation
- Deploying the governance-controlled trigger contract by calling CozyRouter.deployOwnableTrigger(address,(string,string,string,string),bytes32)
- Deploying the Safety Module by calling CozyRouter.deploySafetyModule(address,address,((uint256,address)[],(address,address,bool)[],(uint64,uint64,uint64)),bytes32)
- Update the Safety Module metadata by calling CozyRouter.updateSafetyModuleMetadata(address,address,(string,string,string,string))

`;
    const CozyRouterABI = require("./abis/CozyRouter.json");
    const iface = new ethers.utils.Interface(CozyRouterABI);
    const signedCalldatas = [];

    for (i = 0; i < funcSigs.length; i++) {
        signedCalldatas.push(iface.encodeFunctionData(funcSigs[i], funcParams[i]));
    }

    console.log("Proposal contents");
    console.log({targets, values, funcSigs, calldatas, signedCalldatas, msg});

    return {targets, values, funcSigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
