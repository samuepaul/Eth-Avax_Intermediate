// Import necessary modules
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * Deploys the DogiToken contract.
 */
async function deployContract() {
  const DogiToken = await hre.ethers.getContractFactory("DogiToken");
  const dogitoken = await DogiToken.deploy(); // Corrected line
  await dogitoken.deployed();
  console.log("DogiToken deployed to:", dogitoken.address); // Corrected line
 
  return dogitoken.address; // Corrected line
 } 

/**
 * Writes deployed contract address to a file.
 * @param {string} address - The contract address.
 */
function exportAddress(address) {
  const content = `export const DogiTokenAddress = '${address}';\n`;
  const filePath = path.join(__dirname, 'address.js'); // Corrected line
  fs.writeFileSync(filePath, content);
 }
 
// Main function
async function main() {
  try {
    const address = await deployContract();
    exportAddress(address);
    process.exit(0);
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exit(1);
  }
}

main();
