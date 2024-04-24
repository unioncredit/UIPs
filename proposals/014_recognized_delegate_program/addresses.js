const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                multisigWallet: "0xB869146C2d215B359E875aab583dA3F54440f278"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                multisigWallet: "0xB869146C2d215B359E875aab583dA3F54440f278"
            });
            break;
    }
});

module.exports = addresses;
