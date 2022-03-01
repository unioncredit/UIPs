const getAddresses = chainId => {
    switch (chainId) {
        case "1":
            return {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
                governorAddress: "0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e",
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                arbConnectorAddress: "0x307ED81138cA91637E432DbaBaC6E3A42699032a"
            };
        case "4":
            return {
                unionTokenAddress: "0xC7071B73D019aE9F5CC00ac9b506643b8A6a2b05",
                governorAddress: "0x30CE06AE0D282F25Ee8AFDf1536229bc48B0Bac8",
                treasuryAddress: "0xC3FdB85912a2f64FC5eDB0f6c775B33B22317F89",
                arbConnectorAddress: "0xA5770c37B6824f47ac9480F0bE30E2Da6b8Bc199"
            };
        case "31337": // Use mainnet addresses for the simulation
            return {
                unionTokenAddress: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
                governorAddress: "0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e",
                timelockAddress: "0xBBD3321f377742c4b3fe458b270c2F271d3294D8",
                treasuryAddress: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                arbConnectorAddress: "0x307ED81138cA91637E432DbaBaC6E3A42699032a"
            };
        default:
            throw new Error("Unsupported network");
    }
};
module.exports = getAddresses;
