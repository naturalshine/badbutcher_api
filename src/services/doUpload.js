const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const multer  = require('multer');

require('dotenv').config();

const Slaughter = require("../models/slaughter.model");


const doUpload = async (req, res) => {  
    let imgPath = process.env.SLAUGHTERPATH
    let srcDir = '/' + imgPath + process.env.SLAUGHTERDIR
    let imageBuffer

    try{
        const uri = req.body.image.split(';base64,').pop()
        let firstBuffer = Buffer.from(uri, 'base64');
        imageBuffer = await sharp(firstBuffer).toBuffer();
    } catch (error){
        console.log(error);
        res.status(500).json({
            "error": error,
        });
    }

    // save to server 
    //let imgPath = process.env.SLAUGHTERPATH
    //let srcDir = '/' + imgPath + process.env.SLAUGHTERDIR
    console.log("IMG DIR " + srcDir + "/" + imgPath)
    let fileCount; 

    try{
        fileCount = await Slaughter.count();
        console.log("count =>", fileCount);
    } catch (error){
        console.log(error);
        res.status(500).json({
            "error": error,
        });
    }
    const imgNum = fileCount + 1;
    const imgName = "butcher" + imgNum.toString()
    const origImg = srcDir + '/' + imgName + '.png';


    try {
        await sharp(imageBuffer).toFormat('png').toFile(path.resolve(__dirname, '../' + origImg));
    } catch(error) {
        console.log(error);
        res.status(500).json({
            "error": error,
        });
    }

    const imgMongoInsert = {}
    imgMongoInsert.originalImage = origImg;
    imgMongoInsert.imageName = imgName;

    // create entry in db
    try{
        const slaughtered = await Slaughter.create(imgMongoInsert);
        console.log(slaughtered._id)
        // return id            
        res.status(201).json({
            "id": slaughtered._id
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            "error": error,
        });
    }

}

module.exports = {
    doUpload,
}