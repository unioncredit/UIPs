const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "31337":
            // For simulations
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C", //Address on Mainnet
                uDaiAddr: "0x954F20DF58347b71bbC10c94827bE9EbC8706887",
                uDaiAddrL2: "0x954F20DF58347b71bbC10c94827bE9EbC8706887", //Address on Arbitrum
                interestRateAddr: "0xfDd998ce04AB8f48B473cE4C9af1C2F8F8E264Eb",
                interestRateAddrL2: "0x051e2514E3fE8da88CaA2951442a21042BCe99Ea", //Address on Arbitrum
                timelockAddr: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                timelockAddrL2: "0xCce4321F377742C4B3FE458B270c2f271d32A5e9"
            });
            break;
        case "1":
            // Mainnet
            addresses[networkID] = Object.assign(addresses[networkID], {
                uDaiAddr: "0x954F20DF58347b71bbC10c94827bE9EbC8706887",
                uDaiAddrL2: "0x954F20DF58347b71bbC10c94827bE9EbC8706887", //Address on Arbitrum
                interestRateAddr: "0xfDd998ce04AB8f48B473cE4C9af1C2F8F8E264Eb",
                interestRateAddrL2: "0x051e2514E3fE8da88CaA2951442a21042BCe99Ea" //Address on Arbitrum
            });
            break;
        case "5":
            // Goerli
            addresses[networkID] = Object.assign(addresses[networkID], {
                uDaiAddr: "0x95b43b1555653C721aE1FA22d8B6fF1348d9eF33", //Address on Goerli
                uDaiAddrL2: "0x954F20DF58347b71bbC10c94827bE9EbC8706887",
                interestRateAddr: "0x87dA03DDD0763cC9c6D78151883b38E8c1B61CE2", //Address on Goerli
                interestRateAddrL2: "0x051e2514E3fE8da88CaA2951442a21042BCe99Ea"
            });
            break;
    }
});

module.exports = addresses;
