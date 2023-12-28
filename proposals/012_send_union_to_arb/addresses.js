const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                arbConnectorAddress: "0x307ED81138cA91637E432DbaBaC6E3A42699032a"
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
