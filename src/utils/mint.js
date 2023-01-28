require("dotenv").config();

const { ethers } = require('ethers')

const contractABI = require('../../abis/contract-abi.json');

const mintToken = async(pinataUrl, royaltyHolder, royalty, butcheredOwner) => {
    try{
        const privateKey = `0x${process.env.PRIVATE_KEY}`;
        const wallet = new ethers.Wallet(privateKey);
        const provider = new ethers.providers.AlchemyProvider(80001, process.env.ALCHEMY_KEY)

        wallet.provider = provider;
        const signer = wallet.connect(provider);
    
        const nft = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            contractABI,
            signer
        );

        let tokenId;
        const finalRoyalty = Math.trunc(royalty * 100)

        await nft
            .mintWithRoyalty(butcheredOwner, pinataUrl, royaltyHolder, finalRoyalty)
            .then((tx) => tx.wait(5))
            .then((receipt) => {
                console.log(`Confirmed! Your transaction receipt is: ${receipt.transactionHash}`)
                tokenId = parseInt(receipt.logs[0].topics[3], 16)
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
                message: tokenId
            }

    } catch(error){
        return {
            success: false, 
            message: error
        }
    }
}       

module.exports = {
    mintToken,
}