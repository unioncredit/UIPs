const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                cozyRouter: "0x707C39F1AaA7c8051287b3b231BccAa8CD72138f",
                cozyMetadataRegistry: "0xD2168C6c33fEe907FB12024E5e7e9219083fBb19",
                timelock: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                safetyModulePauser: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8",
                reservePoolAsset: "0x3A2819B07981234F825E952f32Cf977db5EDBf7C",
                triggerPayoutHandler: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                unionTrigger: "0x6C306E34A8CF50f12A70596Cd83c65be9DF51157",
                unionSafetyModule: "0x973351191dcC578fC1CE3c650102BAacb76310Ba"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                cozyRouter: "0x707C39F1AaA7c8051287b3b231BccAa8CD72138f",
                cozyMetadataRegistry: "0xD2168C6c33fEe907FB12024E5e7e9219083fBb19",
                timelock: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                safetyModulePauser: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8",
                reservePoolAsset: "0x3A2819B07981234F825E952f32Cf977db5EDBf7C",
                triggerPayoutHandler: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                unionTrigger: "0x6C306E34A8CF50f12A70596Cd83c65be9DF51157",
                unionSafetyModule: "0x973351191dcC578fC1CE3c650102BAacb76310Ba"
            });
            break;
    }
});

module.exports = addresses;
