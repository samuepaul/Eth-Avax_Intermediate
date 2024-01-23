const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("DogiAvaxToken", function () {
  let DAVT;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const DAVTContract = await ethers.getContractFactory("DogiAvaxToken");
    DAVT = await DAVTContract.deploy();

    // Mint some tokens to the contract creator
    await DAVT.mint(owner.address, 6);
  });

  it("Should return the correct name, symbol, and total supply", async function () {
    expect(await DAVT.name()).to.equal("Dogi Avax Token");
    expect(await DAVT.symbol()).to.equal("DAVT");
    expect(await DAVT.totalSupply()).to.equal(12);
  });

  it("Should update balances after minting and burning tokens", async function () {
    // Mint some tokens to address 1
    await DAVT.connect(owner).mint(addr1.address, 2);

    expect(await DAVT.balances(addr1.address)).to.equal(2);
    expect(await DAVT.totalSupply()).to.equal(14);

    // Burn some tokens from the contract creator
    await DAVT.connect(owner).burn(3);

    expect(await DAVT.balances(owner.address)).to.equal(9);
    expect(await DAVT.totalSupply()).to.equal(11);
  });

  it("Should revert if an invalid address is provided to mint", async function () {
    await expect(DAVT.connect(owner).mint("0x0000000000000000000000000000000000000000", 1)).to.be.revertedWith("Invalid address");
  });

  it("Should revert if the contract creator doesn't have sufficient balance to burn", async function () {
    await expect(DAVT.connect(owner).burn(16)).to.be.revertedWith("Insufficient balance");
  });
});
