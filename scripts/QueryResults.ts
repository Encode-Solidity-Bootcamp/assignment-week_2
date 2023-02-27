import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";
dotenv.config();

async function main() {
    //receive address of ballot as parameter from CLI
    const ballotAddress = process.argv[2];
    
    //get a provider
    const provider = new ethers.providers.InfuraProvider(
        "goerli",
        process.env.INFURA_API_KEY
        );

    //get your signer from .env
    const privateKey = process.env.PRIVATE_KEY;

    if(!privateKey || privateKey.length <= 0)
        throw new Error("Missing private key");

    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${wallet.address}`)

    //create a contract instance (attach)
    const factory =  new Ballot__factory(signer);
    const contractInstance = factory.attach(ballotAddress)

    //interact
    const winningProposal = await contractInstance.winningProposal();
    console.log(`getting the voting results`);
    const winnerNameBytes = await contractInstance.winnerName()
    const winnerName = ethers.utils.parseBytes32String(winnerNameBytes);

    console.log(`The winning proposal is proposal: ${winningProposal.toString()} with the winner name ${winnerName}`)
    
    }

    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      }); 