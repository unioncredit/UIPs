const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                baseConnectorAddress: "0x08447c9a86efe321fc3c54b8cddb7d5d516ce121",
                baseOwnerAddr: "0x20473Af81162B3E79F0333A2d8D64C88a71B88e8",
                baseComptrollerAddr: "0x37C092D275E48e3c9001059D9B7d55802CbDbE04",
                baseBridgeAddress: "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                baseConnectorAddress: "0x08447c9a86efe321fc3c54b8cddb7d5d516ce121",
                baseOwnerAddr: "0x20473Af81162B3E79F0333A2d8D64C88a71B88e8",
                baseComptrollerAddr: "0x37C092D275E48e3c9001059D9B7d55802CbDbE04",
                baseBridgeAddress: "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
            });
            break;
    }
});

module.exports = addresses;
