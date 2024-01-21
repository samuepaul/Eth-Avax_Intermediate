const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("DogiToken", function () {
  let Dogi;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const dogiContract = await ethers.getContractFactory("DogiToken");
    Malima = await dogiContract.deploy();

    // Mint some tokens to the contract creator
    await Dogi.mint(owner.address, 6);
  });

  it("Should return the correct name, symbol, and total supply", async function () {
    expect(await Dogi.name()).to.equal("Eth DogiToken");
    expect(await Dogi.symbol()).to.equal("DGT");
    expect(await Dogi.totalSupply()).to.equal(12);
  });

  it("Should update balances after minting and burning tokens", async function () {
    // Mint some tokens to address 1
    await Dogi.connect(owner).mint(addr1.address, 2);

    expect(await Dogi.balances(addr1.address)).to.equal(2);
    expect(await Dogi.totalSupply()).to.equal(14);

    // Burn some tokens from the contract creator
    await Dogi.connect(owner).burn(3);

    expect(await Dogi.balances(owner.address)).to.equal(9);
    expect(await Dogi.totalSupply()).to.equal(11);
  });

  it("Should revert if an invalid address is provided to mint", async function () {
    await expect(Dogi.connect(owner).mint("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 1)).to.be.revertedWith("Invalid address");
  });

  it("Should revert if the contract creator doesn't have sufficient balance to burn", async function () {
    await expect(Dogi.connect(owner).burn(16)).to.be.revertedWith("Insufficient balance");
  });
});
