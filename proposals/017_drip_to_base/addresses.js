const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                baseConnectorAddress: "0x08447c9a86efe321fc3c54b8cddb7d5d516ce121"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                baseConnectorAddress: "0x08447c9a86efe321fc3c54b8cddb7d5d516ce121"
            });
            break;
    }
});

module.exports = addresses;
