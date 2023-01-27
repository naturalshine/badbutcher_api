require('dotenv').config();

const Slaughter = require("../models/slaughter.model");
const { mintToken } = require("../utils/mint")

const doMint = async (req, res) => {  

    const butcheredObj = await Slaughter.findById(req.body.id);
    
    let mintedToken;
    
    try{
        mintedToken = await mintToken(butcheredObj.ipfsMetadata, butcheredObj.royaltyHolder, butcheredObj.royalty, butcheredObj.butcheredOwner);
        console.log("minted token =>", mintedToken.message);

    } catch(error){
        console.log(error);
        res.status(500).json({
            success: false, 
            error: error,
            message: mintedToken.message
        });

    }

    // retrieve db entry and return

    try{
        await Slaughter.findByIdAndUpdate(req.body.id, 
            {
                "polygonTokenId": mintedToken.message,
                "ethTokenId": req.body.ethTokenId,
            }, {
            new: true,
        });

    
        res.status(201).json({
            "name": butcheredObj.name,
            "polygonTokenId": mintedToken.message,
            "contract": process.env.CONTRACT_ADDRESS
        });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    
    }
}

module.exports = {
    doMint,
}