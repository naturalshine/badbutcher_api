require("dotenv").config();

const { ethers } = require('ethers')

const contractABI = require('../../contract-abi.json');
/*
const mintToken = async(pinataUrl, royaltyHolder, royalty) => {
    try{        
        const contractAddress = process.env.CONTRACT_ADDRESS
        const PolyBadButcher = await ethers.getContractFactory("PolyBadButcher")
        //const [owner] = await ethers.getSigners()

        const finalRoyalty = Math.trunc(royalty * 100)
        
        const tokenId = await PolyBadButcher.attach(contractAddress).mintWithRoyalty(process.env.CSTWALLET, pinataUrl, royaltyHolder, finalRoyalty )
        console.log("tokenId =>", tokenId)


        // TODO: 
        return {
            success:true,
            message: tokenId
        }

    } catch (error){
        return {
            success:false,
            message: error
        }

    }

 }

        const contractAddress = process.env.CONTRACT_ADDRESS
        const PolyBadButcher = await ethers.getContractFactory("PolyBadButcher")
        //const [owner] = await ethers.getSigners()

        const finalRoyalty = Math.trunc(royalty * 100)
         
*/

const mintToken = async(pinataUrl, royaltyHolder, royalty, butcheredOwner) => {
    let nft;
    try{
        const privateKey = `0x${process.env.PRIVATE_KEY}`;
        const wallet = new ethers.Wallet(privateKey);
        const provider = new ethers.providers.AlchemyProvider(80001, process.env.ALCHEMY_KEY)

        wallet.provider = provider;
        const signer = wallet.connect(provider);
    
        nft = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            contractABI,
            signer
        );
    
    } catch (error){
        console.log(error)
    }

  console.log("Waiting for 5 blocks to confirm...");

  let mintedToken;
  const finalRoyalty = Math.trunc(royalty * 100)

  await nft
        .mintWithRoyalty(butcheredOwner, pinataUrl, royaltyHolder, finalRoyalty)
        .then((tx) => tx.wait(5))
        .then((receipt) => {
            console.log(`Confirmed! Your transaction receipt is: ${receipt.transactionHash}`)
            mintedToken = receipt    
        })
        .catch((error) => {
            console.log("Something went wrong", error)
            return {
                success: false,
                message: error
            }
        });

    return {
        success:true,
        message: mintedToken
    }
}

module.exports = {
    mintToken,
}




/*const { ethers } = require("ethers")
const fs = require('fs')

require('dotenv').config();

const privateKey = fs.readFileSync("../.secret").toString().trim()

const QUICKNODE_HTTP_ENDPOINT = process.env.QUICKNODE_HTTP
const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_HTTP_ENDPOINT)

const contractAddress = "0xB0C35A41994b75B98fA148b24Fcf0a84db21751D"
const contractAbi = fs.readFileSync("abi.json").toString()
const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider)

async function getGasPrice() {
    let feeData = await provider.getFeeData()
    return feeData.gasPrice
}

async function getWallet(privateKey) {
    const wallet = await new ethers.Wallet(privateKey, provider)
    return wallet
}

async function getChain(_provider) {
    let chainId = await _provider.getNetwork()
    return chainId.chainId
}

async function getContractInfo(index, id) {
    let contract = await contractInstance.getERC1155byIndexAndId(index, id)
    return contract;
}

async function getNonce(signer) {
    return (await signer).getTransactionCount()
}

async function mintERC721(index, name, amount) {
    try {
        if (await getChain(provider) === process.env.CHAIN_ID) {
            const wallet = getWallet(privateKey)
            const nonce = await getNonce(wallet)
            const gasFee = await getGasPrice()
            let rawTxn = await contractInstance.populateTransaction.mintERC721(index, name, amount, {
                gasPrice: gasFee, 
                nonce: nonce
            })
            console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
            let signedTxn = (await wallet).sendTransaction(rawTxn)
            let reciept = (await signedTxn).wait()
            if (reciept) {
                console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", (await signedTxn).hash + '\n' + "Block Number: " + (await reciept).blockNumber + '\n' + "Navigate to https://polygonscan.com/tx/" + (await signedTxn).hash, "to see your transaction")
            } else {
                console.log("Error submitting transaction")
            }
        }
        else {
            console.log("Wrong network - Connect to configured chain ID first!")
        }
    } catch (e) {
        console.log("Error Caught in Catch Statement: ", e)
    }
}

module.exports = {
    mintERC721,
}*/