const addresses = require("../../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "5":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x23B0483E07196c425d771240E81A9c2f1E113D3A", //Address on goerli
                uTokenAddressL2: "0x792ACBbF38Df3A60ABa14851fC518620C7AE386c", //Address on optimism-goerli
                opOwnerAddress: "0x5eFD403912661A984B810814Ba366Aa633777353" //Address on optimism-goerli
            });
            break;
        case "420":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x23B0483E07196c425d771240E81A9c2f1E113D3A", //Address on goerli
                uTokenAddressL2: "0x792ACBbF38Df3A60ABa14851fC518620C7AE386c", //Address on optimism-goerli
                opOwnerAddress: "0x5eFD403912661A984B810814Ba366Aa633777353" //Address on optimism-goerli
            });
            break;
    }
});

module.exports = addresses;
