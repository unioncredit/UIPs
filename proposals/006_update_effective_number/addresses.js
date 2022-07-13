const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C", //Address on Mainnet
                sumOfTrustAddr: "0xaB1BAD428017C0f077d7E61c3524842ae5bc2e3C", //Address on Mainnet
                sumOfTrustAddrL2: "0x754AE2eC8127080C63694162941Ea2BE725a90a2" //Address on Arbitrum
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C", //Address on Mainnet
                sumOfTrustAddr: "0xaB1BAD428017C0f077d7E61c3524842ae5bc2e3C", //Address on Mainnet
                sumOfTrustAddrL2: "0x754AE2eC8127080C63694162941Ea2BE725a90a2" //Address on Arbitrum
            });
            break;
    }
});

module.exports = addresses;
