const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C", //Address on Mainnet
                assetManagerAddress: "0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275", //Address on Arbitrum
                adapterAddress: "" //Address on Arbitrum
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C", //Address on Mainnet
                assetManagerAddress: "0x7Aecd107Cb022e1DFd42cC43E9BA94C38BC83275", //Address on Arbitrum
                adapterAddress: "" //Address on Arbitrum
            });
            break;
    }
});

module.exports = addresses;
