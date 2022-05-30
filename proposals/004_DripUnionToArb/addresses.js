const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                arbConnectorAddress: "0x307ED81138cA91637E432DbaBaC6E3A42699032a"
            });
            break;
        case "4":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0xC3FdB85912a2f64FC5eDB0f6c775B33B22317F89",
                arbConnectorAddress: "0xA5770c37B6824f47ac9480F0bE30E2Da6b8Bc199"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                arbConnectorAddress: "0x307ED81138cA91637E432DbaBaC6E3A42699032a"
            });
            break;
    }
});

module.exports = addresses;
