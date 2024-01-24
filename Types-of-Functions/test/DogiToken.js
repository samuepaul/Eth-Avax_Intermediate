const { expect } = require("chai");
const { ethers } = require("hardhat");

// Describe block for DogiTokenMint contract tests
describe("DogiTokenMint Tests", function () {
  let KingsToken, kingsToken, deployer, user;

  // Common setup before each test
  beforeEach(async function () {
    // Get the ContractFactory for KingsTokenMint and initialize signers
    DogiToken = await ethers.getContractFactory("DogiTokenMint");
    [deployer, user] = await ethers.getSigners();

    // Deploy the DogiToken contract for testing
    dogiToken = await DogiToken.deploy();
  });

  // Group of tests for initial contract deployment
  describe("Initial Deployment", function () {
    it("should correctly set the token name, symbol, and owner", async function () {
      // Validate the token name, symbol, and owner after deployment
      expect(await dogiToken.tokenName()).to.equal("Dogi Token");
      expect(await dogiToken.tokenSymbol()).to.equal("DGT");
      expect(await dogiToken.owner()).to.equal(deployer.address);
    });
  });

  // Group of tests for minting functionality
  describe("Dogi Token Minting", function () {
    it("should only allow the owner to mint tokens", async function () {
      // Attempt to mint tokens by a non-owner and expect failure
      const mintByNonOwner = DogiToken.connect(user).mint(user.address, 100);
      await expect(mintByNonOwner).to.be.revertedWith("Only owner can perform this action!");

      // Check that the balance and total supply are unchanged
      expect(await dogiToken.balance(user.address)).to.equal(0);
      expect(await dogiToken.totalSupply()).to.equal(0);
    });
  });

  // Group of tests for token transfer functionality
  describe("Token Transfers", function () {
    beforeEach(async function () {
      // Mint tokens for the deployer before each transfer test
      await dogiToken.connect(deployer).mint(deployer.address, 100);
    });

    it("should allow token transfers between accounts", async function () {
      // Transfer tokens and validate balances of sender and receiver
      await dogiToken.transfer(user.address, 50);

      expect(await dogiToken.balance(user.address)).to.equal(50);
      expect(await dogiToken.balance(deployer.address)).to.equal(50);
    });

    it("should reject transfers exceeding the sender's balance", async function () {
      // Attempt to transfer more tokens than available and expect failure
      const excessiveTransfer = dogiToken.transfer(user.address, 101);
      await expect(excessiveTransfer).to.be.revertedWith("Transfer amount exceeds balance");
    });

    it("should prevent self-transfers of tokens", async function () {
      // Attempt self-transfer of tokens and expect failure
      const selfTransfer = dogiToken.transfer(deployer.address, 50);
      await expect(selfTransfer).to.be.revertedWith("You can not transfer token(s) to yourself!");
    });
  });

  // Group of tests for token burning functionality
  describe("Token Burning", function () {
    beforeEach(async function () {
      // Mint tokens for the deployer before each burn test
      await dogiToken.connect(deployer).mint(deployer.address, 100);
    });

    it("should allow tokens to be burned, reducing total supply", async function () {
      // Burn tokens and validate the new balance and total supply
      await dogiToken.burn(50);

      expect(await dogiToken.balance(deployer.address)).to.equal(50);
      expect(await dogiToken.totalSupply()).to.equal(50);
    });

    it("should reject burn attempts exceeding the owner's balance", async function () {
      // Attempt to burn more tokens than the balance and expect failure
      const excessiveBurn = dogiToken.connect(deployer).burn(101);
      await expect(excessiveBurn).to.be.revertedWith("Insufficient balance");
    });
  });
});
