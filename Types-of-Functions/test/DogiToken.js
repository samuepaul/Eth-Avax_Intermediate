const { expect } = require("chai");
const { ethers } = require("hardhat");

// Describe block for KingsTokenMint contract tests
describe("KingsTokenMint Tests", function () {
  let KingsToken, kingsToken, deployer, user;

  // Common setup before each test
  beforeEach(async function () {
    // Get the ContractFactory for KingsTokenMint and initialize signers
    KingsToken = await ethers.getContractFactory("KingsTokenMint");
    [deployer, user] = await ethers.getSigners();

    // Deploy the KingsToken contract for testing
    kingsToken = await KingsToken.deploy();
  });

  // Group of tests for initial contract deployment
  describe("Initial Deployment", function () {
    it("should correctly set the token name, symbol, and owner", async function () {
      // Validate the token name, symbol, and owner after deployment
      expect(await kingsToken.tokenName()).to.equal("Kings Token");
      expect(await kingsToken.tokenSymbol()).to.equal("KGT");
      expect(await kingsToken.owner()).to.equal(deployer.address);
    });
  });

  // Group of tests for minting functionality
  describe("Kings Token Minting", function () {
    it("should only allow the owner to mint tokens", async function () {
      // Attempt to mint tokens by a non-owner and expect failure
      const mintByNonOwner = kingsToken.connect(user).mint(user.address, 100);
      await expect(mintByNonOwner).to.be.revertedWith("Only owner can perform this action!");

      // Check that the balance and total supply are unchanged
      expect(await kingsToken.balance(user.address)).to.equal(0);
      expect(await kingsToken.totalSupply()).to.equal(0);
    });
  });

  // Group of tests for token transfer functionality
  describe("Token Transfers", function () {
    beforeEach(async function () {
      // Mint tokens for the deployer before each transfer test
      await kingsToken.connect(deployer).mint(deployer.address, 100);
    });

    it("should allow token transfers between accounts", async function () {
      // Transfer tokens and validate balances of sender and receiver
      await kingsToken.transfer(user.address, 50);

      expect(await kingsToken.balance(user.address)).to.equal(50);
      expect(await kingsToken.balance(deployer.address)).to.equal(50);
    });

    it("should reject transfers exceeding the sender's balance", async function () {
      // Attempt to transfer more tokens than available and expect failure
      const excessiveTransfer = kingsToken.transfer(user.address, 101);
      await expect(excessiveTransfer).to.be.revertedWith("Transfer amount exceeds balance");
    });

    it("should prevent self-transfers of tokens", async function () {
      // Attempt self-transfer of tokens and expect failure
      const selfTransfer = kingsToken.transfer(deployer.address, 50);
      await expect(selfTransfer).to.be.revertedWith("You can not transfer token(s) to yourself!");
    });
  });

  // Group of tests for token burning functionality
  describe("Token Burning", function () {
    beforeEach(async function () {
      // Mint tokens for the deployer before each burn test
      await kingsToken.connect(deployer).mint(deployer.address, 100);
    });

    it("should allow tokens to be burned, reducing total supply", async function () {
      // Burn tokens and validate the new balance and total supply
      await kingsToken.burn(50);

      expect(await kingsToken.balance(deployer.address)).to.equal(50);
      expect(await kingsToken.totalSupply()).to.equal(50);
    });

    it("should reject burn attempts exceeding the owner's balance", async function () {
      // Attempt to burn more tokens than the balance and expect failure
      const excessiveBurn = kingsToken.connect(deployer).burn(101);
      await expect(excessiveBurn).to.be.revertedWith("Insufficient balance");
    });
  });
});
