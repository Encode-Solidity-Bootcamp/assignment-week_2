import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
//receive address of ballot and voter as parameter from CLI
const ballotAddress = process.argv[2];
const voter = process.argv[3];

//get a provider
const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.INFURA_API_KEY
    );

//get your signer from .env (should be chairperson)
 const privateKey = process.env.PRIVATE_KEY;

 if(!privateKey || privateKey.length <= 0)
    throw new Error("Missing private key");

const wallet = new ethers.Wallet(privateKey);
const signer = wallet.connect(provider);
console.log(`Connected to the wallet ${wallet.address}`)

//create a contract instance (attach)
const factory =  new Ballot__factory(signer);
const signerInstance = factory.attach(ballotAddress)

//interact
const transactionResponse = await signerInstance.giveRightToVote(voter);
console.log(`setting ${voter} to be eligible to vote`);
const txReceipt = await transactionResponse.wait(1);
console.log(txReceipt);

const result = await signerInstance.voters(signer.address);
const voteWeight = result.weight;
console.log(`${voter} is now eligible to vote and his vote weight is: ${voteWeight.toString()}`);


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });