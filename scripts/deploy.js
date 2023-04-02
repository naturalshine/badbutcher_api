async function deployContract() {
  const BoundButcher = await ethers.getContractFactory("BoundButcher")
  const boundButcher = await BoundButcher.deploy()
  await boundButcher.deployed()
  // This solves the bug in Mumbai network where the contract address is not the real one
  const txHash = boundButcher.deployTransaction.hash
  const txReceipt = await ethers.provider.waitForTransaction(txHash)
  const contractAddress = txReceipt.contractAddress
  console.log("Contract deployed to address:", contractAddress)
}

deployContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});