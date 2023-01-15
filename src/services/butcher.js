// Le Butcher 
require('fs')

const axios = require('axios');
const FormData = require('form-data')
require('dotenv').config();

const pinToIPFS = require('../utils/pinata');

const Slaughter = require("../models/slaughter.model");

const mintToken = require("../utils/mint")

const butcherPy = require("../utils/butcherpy")


const doButcher = async (req, res) => {  
    let butcherId, imageBuffer, metadata
    try{

        console.log("doButcher req.body =>", req.body);
        imageBuffer = req.body.image;
        metadata = req.body.metadata;
        
        // save to req metadata to database & return id
        const slaughtered = await Slaughter.create(metadata);
        
        butcherId = slaughtered._id;
        console.log(butcherId);
    } catch(error){
        console.log(error);
        res.status(500).json({
            "error": error,
        });
    }
        
    let imgPath = process.env.SLAUGHTERPATH
    let srcDir = imgPath + process.env.SLAUGHTERDIR
    let nftDir = imgPath + process.env.NFTDIR

    // save image to server file system using variable derived from ? id?
    const origImg = srcDir + butcherId + '.png';


    let newRoyaltyHolder, newRoyaltyAmount

    try{
        // retrieve random record for royalties
        const newRoyaltyHolderRecord = Slaughter.aggregate([{ $sample: { size: 1 } }])
        newRoyaltyHolder = newRoyaltyHolderRecord.minterAddress;
    }catch(error){
        console.log(error)
        newRoyaltyHolder = process.env.CSTWALLET;
    }

    // create random royalty
    newRoyaltyAmount = Math.floor(Math.random() * 100);
    metadata.royaltyHolder = newRoyaltyHolder
    metadata.royaltyAmount = newRoyaltyAmount

    try{
        fs.createWriteStream(origImg).write(imageBuffer);    

    }catch(error){
        console.log(error);
        res.status(500).json({
            "error": error,
        });
    }

    let nftImg, pythonReturn;
    try{
        pythonReturn = butcherPy(butcherId, newRoyaltyHolder, newRoyaltyAmount);
        
        if (!pythonReturn.success){
            throw new Error(pythonReturn.error);
        }

        console.log(pythonReturn.message);
    
        // TODO del interim images named with id or could do this in python


    } catch (error){
        console.log(error)
        res.status(500).json({
            "error": error,
        });
    }

    // location of NFT image
    nftImg = nftDir + butcherId + '.png';

    //get imgBlob of finalImg
    let finalNft
    try{
        const res = await fetch(nftImg);
        console.log(res);
        finalNft = await res.blob();
        console.log(finalNft);
    } catch(error){
        console.log(error)
    }

    let pinataResponse, pinataResponseImg
    try{
        /// PINATA : FIRST, MAKE IMG
        const formData = new FormData();
        formData.append('file', finalNft);
    
        const imgMetadata = JSON.stringify({
          name: "Butchered " + metadata.nftName,
        });
        
        formData.append('pinataMetadata', imgMetadata);
        
        const options = JSON.stringify({
          cidVersion: 0,
        })
    
        formData.append('pinataOptions', options);
        
        pinataResponseImg = await pinToIPFS("pinFileToIPFS", formData);
        
        if (!pinataResponseImg.success) {
            throw new Error('Pinata image handling failed')
        }

        metadata.image = pinataResponseImg.pinataUrl
        
        // THEN, MAKE METADATA
        pinataResponse = await pinToIPFS("pinJSONToIPFS", metadata);
        if (!pinataResponse.success) {
            throw new Error('Pinata metadata handling failed')
        } 
    
    } catch(error){
        console.log(error)
    }

    let mintedToken;
    try{
        mintedToken = await mintToken(pinataResponse.pinataUrl);
    } catch(error){
        console.log(error);
    }

    console.log("minted token =>", mintedToken);

    try{
        const nftUpdate = await Slaughter.findByIdAndUpdate(butcherId, 
            {
                "originalImage": origImg, 
                "slaughteredImg": nftImg,
                "royaltyHolder": newRoyaltyHolder,
                "royaltyAmount": newRoyaltyAmount,
                "ipfsImg": pinataResponseImg.pinataUrl,
                "ipfsMetadata": pinataResponse.pinataUrl,
                "mintedToken": mintedToken
            }, {
            new: true,
        });

    
        res.status(201).json({
            "image": finalNft,
            "royaltyHolder": newRoyaltyHolder,
            "royaltyAmount": newRoyaltyAmount,
            "metadata": pinataResponse.pinataUrl,
            "image": pinataResponseImg.pinataUrl,
            "mintedToken": mintedToken
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    
    }

}



module.exports = {
    doButcher
}