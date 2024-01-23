// imports
const hre = require("hardhat");
const fs = require('fs');

// funtion to deploy the contracts
async function main() {

  //deploy the token
  const DAVT = await hre.ethers.getContractFactory("DogiAvaxToken");
  const davt = await DAVT.deploy();
  await davt.deployed();
  console.log("davt deployed to:", davt.address);


  // export the addresses
  fs.writeFileSync('src/abi/address.js', `
    export const avtnAddress = "${davt.address}"

  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
