const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                optimismBridgeAddress: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1",
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
        case "5":
            addresses[networkID] = Object.assign(addresses[networkID], {
                optimismBridgeAddress: "0x5086d1eEF304eb5284A0f6720f79403b4e9bE294",
                treasuryAddr: "0xc124047253c87EF90aF9f4EFC12C281b479c4769",
                opOwnerAddr: "0xDEFF35f5282d4325d87EAbF63F2c60c602A2b8a6",
                opUserManagerAddr: "0xe2732f6E7306908697D111A53806C5883eaf0fc5",
                opComptrollerAddr: "0x4A89d70e17F9e765077dfF246c84B47c1181c473",
                newOpConnectorAddr: "0x0E5A7D7d373b2bdd7829D6e771492610A27551e3",
                newOpUnionAddr: "0x5EDD1521Db3AC7F188D066dbdd76e50C9482D1d6",
                newComptrollerLogic: "0x42d7A03330dE0F0e58D307aF61Fa74Ba210d85b9",
                newUserManagerLogic: "0x1A03bBCB3CE86f4Deb79682260B228aa870a2Eee"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                optimismBridgeAddress: "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1",
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
