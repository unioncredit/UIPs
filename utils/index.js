const {ethers} = require("hardhat");

const waitNBlocks = async n => {
    await Promise.all(
        [...Array(n).keys()].map(async () => {
            await ethers.provider.send("evm_mine");
        })
    );
};

const tenderlyWaitNBlocks = async n => {
    await ethers.provider.send("evm_increaseBlocks", [ethers.utils.hexValue(n)]);
};

const increaseTime = async seconds => {
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
};

const encodeParameters = (types, values) => {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
};

function etherMantissa(num, scale = 1e18) {
    if (num < 0) return ethers.BigNumber.from(ethers.BigNumber.from(2).pow(256).plus(num).toFixed());
    return ethers.BigNumber.from(ethers.BigNumber.from(num).times(scale).toFixed());
}

function etherUnsigned(num) {
    return ethers.BigNumber.from(ethers.BigNumber.from(num).toFixed());
}

module.exports = {
    waitNBlocks,
    tenderlyWaitNBlocks,
    increaseTime,
    encodeParameters,
    etherMantissa,
    etherUnsigned
};
