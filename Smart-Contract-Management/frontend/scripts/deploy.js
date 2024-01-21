// imports
const hre = require("hardhat");
const fs = require('fs');

// function to deploy the contracts
async function main() {

  //deploy the token
  const Dogi = await hre.ethers.getContractFactory("DogiToken");
  const dogi = await Dogi.deploy();
  await dogi.deployed();
  console.log("dogi deployed to:", dogi.address);


  // export the addresses
  fs.writeFileSync('src/abi/address.js', `
    export const dogiAddress = "${dogi.address}"

  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
