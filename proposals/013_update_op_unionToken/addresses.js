const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96",
                opUserManagerAddr: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
                opComptrollerAddr: "0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3",
                newOpConnectorAddr: "",
                newOpUnionAddr: "",
                newComptrollerLogic: "",
                newUserManagerLogic: ""
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                treasuryAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96",
                opUserManagerAddr: "0x8E195D65b9932185Fcc76dB5144534e0f3597628",
                opComptrollerAddr: "0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3",
                newOpConnectorAddr: "",
                newOpUnionAddr: "",
                newComptrollerLogic: "",
                newUserManagerLogic: ""
            });
            break;
    }
});

module.exports = addresses;
