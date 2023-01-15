require('dotenv').config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_KEY_SECRET;

const axios = require('axios');

const pinToIPFS = async(pinataUrl, JSONBody) => {
    const url = "https://api.pinata.cloud/pinning/" + pinataUrl;
    
    //making axios POST request to Pinata
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

module.exports = {
    pinToIPFS,
}