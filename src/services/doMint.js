require('dotenv').config();

const Slaughter = require("../models/slaughter.model");
const { mintToken } = require("../utils/mint")

const doMint = async (req, res) => {  
    try{

        const butcheredObj = await Slaughter.findById(req.body.id);
        
        const mintedToken = await mintToken(butcheredObj.ipfsMetadata, butcheredObj.royaltyHolder, butcheredObj.royalty, butcheredObj.butcheredOwner);

        // retrieve db entry and return
        await Slaughter.findByIdAndUpdate(req.body.id, 
            {
                "polygonTokenId": mintedToken.message,
                "ethTokenId": req.body.ethTokenId,
            }, {
            new: true,
        });

        console.log("Mint complete with token id =>", mintedToken.message);
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