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

const voteProposal = async (governor, defaultAccountAddress) => {
    let res;
    const proposalId = await governor.latestProposalIds(defaultAccountAddress);

    const votingDelay = await governor.votingDelay();
    await waitNBlocks(parseInt(votingDelay) + 10);

    res = await governor.state(proposalId);
    res.toString().should.eq("1");

    await governor.castVote(proposalId, 1);
    const votingPeriod = await governor.votingPeriod();
    await waitNBlocks(parseInt(votingPeriod));

    res = await governor.state(proposalId);
    res.toString().should.eq("4");

    console.log(`Queueing proposal Id: ${proposalId}`);

    await governor["queue(uint256)"](proposalId);

    await increaseTime(7 * 24 * 60 * 60);

    res = await governor.getActions(proposalId);
    console.log(res.toString());

    console.log(`Executing proposal Id: ${proposalId}`);

    await governor["execute(uint256)"](proposalId);
};

module.exports = {
    waitNBlocks,
    tenderlyWaitNBlocks,
    increaseTime,
    encodeParameters,
    etherMantissa,
    etherUnsigned,
    voteProposal
};
