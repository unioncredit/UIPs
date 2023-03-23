const addresses = require("../../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "5":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x23B0483E07196c425d771240E81A9c2f1E113D3A", //Address on goerli
                fixedRateInterestModelL2: "0x855d222553c0fF835e1C319C19A37f973101ce83", //Address on optimism-goerli
                opOwnerAddress: "0x1730714dabac5F351A234de4307d868767A04295" //Address on optimism-goerli
            });
            break;
        case "420":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x23B0483E07196c425d771240E81A9c2f1E113D3A", //Address on goerli
                fixedRateInterestModelL2: "0x855d222553c0fF835e1C319C19A37f973101ce83", //Address on optimism-goerli
                opOwnerAddress: "0x1730714dabac5F351A234de4307d868767A04295" //Address on optimism-goerli
            });
            break;
    }
});

module.exports = addresses;
