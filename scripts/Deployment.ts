import { ethers } from "hardhat";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];


function convertStringArrayToBytes32(array: string[]){
    const bytes32Array = [];
    for (let index=0; index < array.length; index++){
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    const args = process.argv;
    const proposals = args.slice(2);
    if (proposals.length <= 0) throw new Error("Missing parameters:proposals");

    const provider = ethers.getDefaultProvider("goerli");
    console.log({provider});
    const lastBlock = await provider.getBlock("latest");
    console.log({ lastBlock })

    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    
    
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS)
        );
    console.log
    await ballotContract.deployTransaction.wait();
    console.log(`The Ballot contract was deployed at thed address ${ballotContract.address}`)
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})