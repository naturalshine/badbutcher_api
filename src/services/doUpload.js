const sharp = require('sharp');
const path = require('path');

require('dotenv').config();

const Slaughter = require("../models/slaughter.model");


const doUpload = async (req, res) => {  
    try{

        const imgPath = process.env.SLAUGHTERPATH
        const srcDir = '/' + imgPath + process.env.SLAUGHTERDIR

        const uri = req.body.image.split(';base64,').pop()
        const firstBuffer = Buffer.from(uri, 'base64');
        const imageBuffer = await sharp(firstBuffer).toBuffer();

        const fileCount = await Slaughter.count();

        const imgNum = fileCount + 1;
        const imgName = "butcher" + imgNum.toString()
        const origImg = srcDir + '/' + imgName + '.png';

        await sharp(imageBuffer).toFormat('png').toFile(path.resolve(__dirname, '../' + origImg));

        const imgMongoInsert = {}
        imgMongoInsert.originalImage = origImg;
        imgMongoInsert.imageName = imgName;

         const slaughtered = await Slaughter.create(imgMongoInsert);
        console.log("Upload complete with id  =>", slaughtered._id)

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