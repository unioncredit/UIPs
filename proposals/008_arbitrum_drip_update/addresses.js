const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "31337":
            // For simulations
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                arbConnectorAddr: "0x307ED81138cA91637E432DbaBaC6E3A42699032a",
                arbComptrollerAddr: "0x641DD6258cb3E948121B10ee51594Dc2A8549fe1"
            });
            break;
        case "1":
            // Mainnet
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                arbConnectorAddr: "0x307ED81138cA91637E432DbaBaC6E3A42699032a",
                arbComptrollerAddr: "0x641DD6258cb3E948121B10ee51594Dc2A8549fe1"
            });
            break;
    }
});

module.exports = addresses;
