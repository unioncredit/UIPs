const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                cozyRouter: "0xC58F8634E085243CC661b1623B3bC3224D80B439",
                cozyMetadataRegistry: "0xA97a1cC5609E8149b5fe0902F9076BF125009346",
                timelock: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                safetyModulePauser: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8",
                reservePoolAsset: "0x3A2819B07981234F825E952f32Cf977db5EDBf7C",
                triggerPayoutHandler: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                unionTrigger: "0x1fadDD0E384b5Fe42DD44b6Ae62942D85CAF5a3A",
                unionSafetyModule: "0xBf615260a268101D028E420F9A8829c9F6809C91"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                cozyRouter: "0xC58F8634E085243CC661b1623B3bC3224D80B439",
                cozyMetadataRegistry: "0xA97a1cC5609E8149b5fe0902F9076BF125009346",
                timelock: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                safetyModulePauser: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8",
                reservePoolAsset: "0x3A2819B07981234F825E952f32Cf977db5EDBf7C",
                triggerPayoutHandler: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                unionTrigger: "0x1fadDD0E384b5Fe42DD44b6Ae62942D85CAF5a3A",
                unionSafetyModule: "0xBf615260a268101D028E420F9A8829c9F6809C91"
            });
            break;
    }
});

module.exports = addresses;
