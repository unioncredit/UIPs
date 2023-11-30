const addresses = require("../../utils/addresses.js");

Object.keys(addresses).map(networkID => {
    switch (networkID) {
        case "1":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionAddr: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
                arbUnionAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                opUnionAddr: "0xB025ee78b54B5348BD638Fe4a6D77Ec2F813f4f9",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96"
            });
            break;
        case "31337":
            addresses[networkID] = Object.assign(addresses[networkID], {
                unionAddr: "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
                arbUnionAddr: "0x6DBDe0E7e563E34A53B1130D6B779ec8eD34B4B9",
                opUnionAddr: "0xB025ee78b54B5348BD638Fe4a6D77Ec2F813f4f9",
                opOwnerAddr: "0x946A2C918F3D928B918C01D813644f27Bcd29D96"
            });
            break;
    }
});

module.exports = addresses;
