const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                multisigWallet: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                multisigWallet: "0xD83b4686e434B402c2Ce92f4794536962b2BE3E8"
            });
            break;
    }
});

module.exports = addresses;
