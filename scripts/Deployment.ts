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
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    PROPOSALS.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    
    
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(PROPOSALS)
        );
    await ballotContract.deployTransaction.wait();
    console.log(`The Ballot contract was deployed at thed address ${ballotContract.address}`)
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})