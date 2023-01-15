/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();
require("@nomiclabs/hardhat-ethers"); 

module.exports = {
   solidity: "0.8.2",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      polygonmumbai: {
         url: "https://polygon-mumbai.g.alchemy.com/v2/eNIltfbe066olUkZ5Q6An9vqWbUINB7u",
         accounts: [`0x${process.env.MUMBAI_KEY}`]
      },
      polygon: {
         url: "https://polygon-mainnet.g.alchemy.com/v2/nv0MZj7S8wr5vOGZXyr0qyJ-fftKx_3U",
         accounts: [`0x${process.env.POLYGON_KEY}`]
      }
    }
}
 