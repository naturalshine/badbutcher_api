async function main() {
    // Grab the contract factory 
    //used to deploy new smart contracts
    const BadButcher = await ethers.getContractFactory("BadButcher");
 
    // Start deployment, returning a promise that resolves to a contract object
    const BTCHR = await BadButcher.deploy(); // Instance of the contract 
    console.log("Contract deployed to address:", BTCHR.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });