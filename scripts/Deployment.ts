import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
      }
      return bytes32Array;
}

async function main() {
  const args = process.argv;
  const proposals = args.slice(2);
  if(proposals.length <= 0) throw new Error("Missing parameters: proposals");

  const provider = new ethers.providers.InfuraProvider(
    "goerli",
    process.env.INFURA_API_KEY
    );
  
  const privateKey = process.env.PRIVATE_KEY;

  if(!privateKey || privateKey.length <= 0)
    throw new Error("Missing private key");
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Connected to the wallet ${wallet.address}`)
     
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Wallet balance: ${balance} Wei`);
  
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal No. ${index + 1}: ${element}`);
  });
  const ballotContractFactory = new Ballot__factory(signer);
  console.log("Deploying contract ..."); 
  const ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(proposals)
    );
   
    const deployTxReceipt = await ballotContract.deployTransaction.wait(1);
    console.log(
        `The Ballot contract was deployed at the address ${ballotContract.address}`
    );
    console.log({deployTxReceipt});

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

