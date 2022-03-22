const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                timelockAddress: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8"
            });
            break;
        case "4":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0xC3FdB85912a2f64FC5eDB0f6c775B33B22317F89"
            });
            break;
        case "42":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x28d1999FDC8a5396b11E86F8fd247a85d4d4D7F9"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                timelockAddress: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8"
            });
            break;
    }
});

module.exports = addresses;
