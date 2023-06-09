const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "31337":
            // For simulations
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                opConnectorAddr: "0xF5690129Bf7AD35358Eb2304f4F5B10E0a9B9d65"
            });
            break;
        case "1":
            // Mainnet
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                opConnectorAddr: "0xF5690129Bf7AD35358Eb2304f4F5B10E0a9B9d65"
            });
            break;
    }
});

module.exports = addresses;
