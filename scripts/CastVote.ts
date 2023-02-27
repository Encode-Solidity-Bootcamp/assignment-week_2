import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
    //receive address of ballot and proposal index from CLI
    const ballotAddress = process.argv[2];
    const proposalIndex = process.argv[3];

    //get a provider
    const provider = new ethers.providers.InfuraProvider(
        "goerli",
        process.env.INFURA_API_KEY
        );

    //get your signer from .env (should be voter)
    const privateKey = process.env.PRIVATE_KEY;
   
   

    ////To create HD wallet, so as to create multiple addresses with one private key

    //const mnemonic = process.env.MNEMONIC;
    // if(!mnemonic || mnemonic.length <= 0)
    //     throw new Error("Missing private key");
    //     const HDNode = ethers.utils.HDNode.fromMnemonic(mnemonic);  
    //     const derivedNode = HDNode.derivePath(`m/44'/60'/0'/0/${1}`);
    //     const derivedNode2 = HDNode.derivePath(`m/44'/60'/0'/0/${2}`);


    if(!privateKey || privateKey.length <= 0)
        throw new Error("Missing private key");

    const wallet = new ethers.Wallet(privateKey);
    
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${wallet.address}`)
    // console.log(`Connected to the wallet ${derivedNode.address}`)
    // console.log(`Connected to the wallet ${derivedNode2.address}`)

//create a contract instance (attach)
    const factory =  new Ballot__factory(signer);
    const signerInstance = factory.attach(ballotAddress)

//interact
    const transactionResponse = await signerInstance.vote(proposalIndex);
    console.log("Voting in progress")
    await transactionResponse.wait(1);

    console.log(`${signer.address} has just voted`);

    const result = await signerInstance.voters(signer.address);
    const hasVoted = result.voted;

    console.log({hasVoted});
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
  