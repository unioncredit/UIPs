require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();

// tasks
require("./tasks/accounts");

module.exports = {
    networks: {
        hardhat: {
            accounts: {
                mnemonic: "test test test test test test test test test test test junk"
            },
            allowUnlimitedContractSize: true
        },
        rinkeby: {
            url: "https://rinkeby.infura.io/v3/" + process.env.INFURA_ID,
            accounts: process.env.PRIVATE_KEY
                ? [process.env.PRIVATE_KEY]
                : {
                      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : process.env.MNEMONIC_TEST
                  }
        },
        kovan: {
            url: "https://kovan.infura.io/v3/" + process.env.INFURA_ID,
            accounts: process.env.PRIVATE_KEY
                ? [process.env.PRIVATE_KEY]
                : {
                      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : process.env.MNEMONIC_TEST
                  }
        },
        mainnet: {
            url: "https://mainnet.infura.io/v3/" + process.env.INFURA_ID,
            accounts: process.env.PRIVATE_KEY
                ? [process.env.PRIVATE_KEY]
                : {
                      mnemonic: process.env.MNEMONIC ? process.env.MNEMONIC : process.env.MNEMONIC_TEST
                  }
        }
    },
    solidity: {
        compilers: [
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 100
                    },
                    evmVersion: "istanbul"
                }
            }
        ]
    },
    paths: {sources: "./proposals"},
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
            4: 0
        }
    }
};
