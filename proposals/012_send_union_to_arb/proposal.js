const {ethers} = require("hardhat");

async function getProposalParams({treasuryAddress, arbConnectorAddress}) {
    if (!treasuryAddress || !arbConnectorAddress) {
        throw new Error("address error");
    }

    const parseUnits = ethers.utils.parseUnits;

    const targets = [treasuryAddress];
    const values = ["0"];
    const sigs = ["editSchedule(uint256,uint256,address,uint256)"];
    const params = [
        "15185500", // drip start block
        parseUnits("1"), // drip rate, in wei
        arbConnectorAddress, // target address
        parseUnits("3696000") // 1 union per block for 1 year + dripped
    ];

    const calldatas = [ethers.utils.defaultAbiCoder.encode(["uint256", "uint256", "address", "uint256"], params)];

    const msg = `
    UIP-012 Update Arbitrum Dripping Schedule

    # Abstract
    
    Update Arbitrum dripping schedule to send another 1,296,000 UNION tokens to Arbitrum.
    
    # Motivation
    
    This proposal aims to resolve the issue identified in UIP-008, which was intended to update the Union dripping schedule for Arbitrum. The problem with UIP-008 was that it proposed dripping a total of 1,296,000 UNION to Arbitrum. However, while updating Arbitrum's existing dripping schedule, UIP-008 mistakenly set the total dripping amount to 1,296,000 without accounting for the amount previously dripped. This error caused the Arbitrum dripping to stop, as the previous dripped amount was already greater than the newly proposed amount. To rectify this, we propose changing the total dripping amount to the sum of the previously dripped amount (2,400,000) and the newly proposed amount (1,296,000), bringing the total to 3,696,000.
    
    # Specification
    
    - Invoke the Treasury.editSchedule() function to modify the dripping schedule for Arbitrum. Set dripStart to the block number at which UIP-008 was executed. The dripRate should be set to 1 UNION per block. Specify the target as the ArbConnector (address: 0x307ED81138cA91637E432DbaBaC6E3A42699032a). Set the total dripping amount to be 3,696,000 UNION.
    
    # Test Cases
    
    Tests and simulations can be found here: PR
    
    # Implementation
    
    Call Treasury.editSchedule() to update the dripping schedule for the Arbitrum.
`;
    const TreasuryABI = require("../../abis/Treasury.json");
    const iface = new ethers.utils.Interface(TreasuryABI);
    const signedCalldatas = [];

    signedCalldatas.push(iface.encodeFunctionData(sigs[0], params));

    console.log("Proposal contents");
    console.log({targets, values, sigs, calldatas, signedCalldatas, msg});

    return {targets, values, sigs, calldatas, signedCalldatas, msg};
}

module.exports = {
    getProposalParams
};
