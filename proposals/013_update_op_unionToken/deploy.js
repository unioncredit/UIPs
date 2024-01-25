const {ethers, getChainId} = require("hardhat");
async function deploy() {
    const chainId = await getChainId();
    console.log({chainId});
    if (chainId != "31337") return;

    const OpUNION = await ethers.getContractFactory("OpUNION");
    const opUnion = await OpUNION.deploy(
        "0x4200000000000000000000000000000000000010",
        "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C"
    );
    await opUnion.deployed();
    console.log(`OpUNION deployed to ${opUnion.address}`);

    const Comptroller = await ethers.getContractFactory("Comptroller");
    const comptroller = await Comptroller.deploy();
    await comptroller.deployed();
    console.log(`Comptroller deployed to ${comptroller.address}`);

    const UserManager = await ethers.getContractFactory("UserManager");
    const userManager = await UserManager.deploy();
    await userManager.deployed();
    console.log(`UserManager deployed to ${userManager.address}`);

    const OpConnector = await ethers.getContractFactory("OpConnector");
    const opConnector = await OpConnector.deploy(
        "0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C",
        opUnion.address,
        "0x06a31efa04453C5F9C0A711Cdb96075308C9d6E3",
        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
    );
    await opConnector.deployed();
    console.log(`OpConnector deployed to ${opConnector.address}`);

    return {
        newOpUnionAddr: opUnion.address,
        newComptrollerLogic: comptroller.address,
        newUserManagerLogic: userManager.address,
        newOpConnectorAddr: opConnector.address
    };
}

module.exports = {
    deploy
};
