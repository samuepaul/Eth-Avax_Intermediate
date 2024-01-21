// Import necessary modules
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

/**
 * Deploys the DogiTokenMint contract.
 */
async function deployContract() {
  const Dogi = await hre.ethers.getContractFactory("DogiTokenMint");
  const dogi = await dogi.deploy();
  await dogi.deployed();
  console.log("Dogi deployed to:", Dogi.address);

  return Dogi.address;
}

/**
 * Writes deployed contract address to a file.
 * @param {string} address - The contract address.
 */
function exportAddress(address) {
  const content = `export const DogiAddress = '${address}';\n`;
  const filePath = path.join(__dirname, 'scripts', 'address.js');
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
