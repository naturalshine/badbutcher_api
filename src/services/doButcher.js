// Le Butcher 
const fs = require('fs');
const FormData = require('form-data');
const sharp = require('sharp');
const path = require('path');


require('dotenv').config();

const { pinToIPFS } = require('../utils/pinata');

const Slaughter = require("../models/slaughter.model");

const { formatMetadata } = require("../utils/metadata")

const { butcherPy } = require("../utils/butcherpy");


const doButcher = async (req, res) => {  

    //TODO --> remove this when further in testing, use incoming from app
    //const imageBuffer = await sharp(path.resolve(__dirname, '../scripts/butcherpy/src_img/milady.avif')).toFormat('png').toBuffer();
    //const img = await fsPromises.readFile(path.resolve(__dirname, './001.png'));

    let butcherId, metadata, slaughtered
    try{

        console.log("doButcher req.body =>", req.body);
    
        metadata = req.body.metadata[0];
        butcherId = req.body.butcherId

        console.log("ID F=> ", req.body.butcherId)

        // format NFT metadata for flat object storage
        const metadataFormat = await formatMetadata(metadata);
        console.log("METADATA =>", metadataFormat);

        slaughtered = await Slaughter.findByIdAndUpdate(butcherId, 
            metadataFormat, {
            new: true,
        });

        console.log("ID RETRIEVE =>", slaughtered._id)
        
    } catch(error){
        console.log(error);
        res.status(500).json({
            "error": error,
        });
    }
    

    // get random wallet from pool of minters for the royalty holder
    let newRoyaltyHolder, newRoyaltyAmount

    try{
        // retrieve random record for royalties
        const newRoyaltyHolderRecord = Slaughter.aggregate([{ $sample: { size: 1 } }])
        newRoyaltyHolder = newRoyaltyHolderRecord.butcherMinter == undefined ? process.env.CSTWALLET : newRoyaltyHolder.butcherMinter;
    
    }catch(error){
        console.log(error)
        newRoyaltyHolder = process.env.CSTWALLET;
    }

    // create random royalty
    newRoyaltyAmount = Math.floor(Math.random() * 100);
    metadata.attributes.push({"trait_type": "royaltyHolder", "value": newRoyaltyHolder});
    metadata.attributes.push({"trait_type": "royalty", "value": newRoyaltyAmount});

    // construct image paths
    let imgPath = process.env.SLAUGHTERPATH
    let nftDir = imgPath + process.env.NFTDIR
    
    // retrieve name of image saved in last api call
    const imageName = slaughtered.imageName;

    let pythonReturn;
    try{
        pythonReturn = await butcherPy(imageName, newRoyaltyHolder, newRoyaltyAmount);
        
        if (!pythonReturn.success){
            throw new Error(pythonReturn.error);
        }

    } catch (error){
        console.log(error)
        res.status(500).json({
            "error": error,
        });
    }

    // location of NFT image
    let nftImg = path.resolve(__dirname, '../' + nftDir + '/' + imageName + '.png')
    
    /*let finalNft;

    try{
        // https://stackoverflow.com/questions/65740056/how-to-send-the-resized-image-from-sharp-back-to-user
        await sharp(nftImg).toBuffer().then((data) => {
            finalNft = data.toString('base64');
        });
    

    } catch(error){
        console.log(error)
    }
    */
    let pinataResponse, pinataResponseImg
    try{
        /// PINATA : FIRST, MAKE IMG
        const formData = new FormData();
        const nftReadStream = fs.createReadStream(nftImg)
        formData.append("file", nftReadStream);

        const imgMetadata = JSON.stringify({"name": metadata.name});
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
        res.status(500).json({
            "error": error,
        });
    }
    
    try{
        const nftUpdate = await Slaughter.findByIdAndUpdate(butcherId, 
            {
                "butcheredImage": nftImg,
                "royaltyHolder": newRoyaltyHolder,
                "royalty": newRoyaltyAmount,
                "ipfsImage": pinataResponseImg.pinataUrl,
                "ipfsMetadata": pinataResponse.pinataUrl            
            }, {
            new: true,
        });

    
        res.status(201).json({
            "name": metadata.name,
            "royaltyHolder": newRoyaltyHolder,
            "royaltyAmount": newRoyaltyAmount,
            "ipfsMetadata": pinataResponse.pinataUrl,
            "ipfsImage": pinataResponseImg.pinataUrl,
            "contract": process.env.CONTRACT_ADDRESS,
            "finalMetadata": metadata,
            "id": butcherId,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    
    }

}



module.exports = {
    doButcher
}