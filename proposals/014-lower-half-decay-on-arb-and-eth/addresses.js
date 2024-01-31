const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                comptrollerAddr: "0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d",
                arbComptrollerAddr: "0x641DD6258cb3E948121B10ee51594Dc2A8549fe1",
                opUserManagerAddr: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96",
                optimismBridgeAddress: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                comptrollerAddr: "0x216dE4089dCdD7B95BC34BdCe809669C788a9A5d",
                arbComptrollerAddr: "0x641DD6258cb3E948121B10ee51594Dc2A8549fe1",
                opUserManagerAddr: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96",
                optimismBridgeAddress: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
            });
            break;
    }
});

module.exports = addresses;
