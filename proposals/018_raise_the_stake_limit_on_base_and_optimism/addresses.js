const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                opUserManagerAddr: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
                opUTokenAddr: "0xE478b5e7A423d7CDb224692d0a816CA146A744b2",
                opComptrollerAddr: "0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96",
                baseUserManagerAddr: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b",
                baseUTokenAddr: "0xc2447f36FfdA08E278D25D08Ea91D942f0C2d6ea",
                baseComptrollerAddr: "0x37C092D275E48e3c9001059D9B7d55802CbDbE04",
                baseOwnerAddr: "0x20473Af81162B3E79F0333A2d8D64C88a71B88e8",
                optimismBridgeAddress: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1",
                baseBridgeAddress: "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                opUserManagerAddr: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
                opUTokenAddr: "0xE478b5e7A423d7CDb224692d0a816CA146A744b2",
                opComptrollerAddr: "0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96",
                baseUserManagerAddr: "0xfd745A1e2A220C6aC327EC55d2Cb404CD939f56b",
                baseUTokenAddr: "0xc2447f36FfdA08E278D25D08Ea91D942f0C2d6ea",
                baseComptrollerAddr: "0x37C092D275E48e3c9001059D9B7d55802CbDbE04",
                baseOwnerAddr: "0x20473Af81162B3E79F0333A2d8D64C88a71B88e8",
                optimismBridgeAddress: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1",
                baseBridgeAddress: "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
            });
            break;
    }
});

module.exports = addresses;
