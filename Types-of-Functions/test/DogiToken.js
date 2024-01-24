const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DogiToken", function () {
    let DogiToken;
    let dogiToken;
    let admin;
    let user1;
    let user2;
    let addrs;
    const initialAmount = 1000;

    beforeEach(async function () {
        DogiToken = await ethers.getContractFactory("DogiToken");
        [admin, user1, user2, ...addrs] = await ethers.getSigners();
        dogiToken = await DogiToken.deploy();
        await dogiToken.deployed();
    });

    describe("Deployment", function () {
        it("should set the right admin", async function () {
            expect(await dogiToken.admin()).to.equal(admin.address);
        });
    });

    describe("createToken", function () {
        it("should only allow admin to create tokens", async function () {
            await expect(dogiToken.connect(user1).createToken(user1.address, 100))
                .to.be.revertedWith("DogiToken: caller is not the admin");

            await expect(dogiToken.connect(admin).createToken(user1.address, 100))
                .not.to.be.reverted;
        });

        it("should increase circulating supply when tokens are created", async function () {
            const supplyBefore = await dogiToken.circulatingSupply();
            await dogiToken.connect(admin).createToken(user1.address, initialAmount);
            const supplyAfter = await dogiToken.circulatingSupply();
            expect(supplyAfter).to.equal(supplyBefore.add(initialAmount));
        });
    });

    describe("eliminate", function () {
        beforeEach(async function () {
            await dogiToken.connect(admin).createToken(user1.address, initialAmount);
        });

        it("should allow token holders to burn tokens", async function () {
            const burnAmount = 100;
            await dogiToken.connect(user1).eliminate(burnAmount);
            const balanceAfter = await dogiToken.accountBalances(user1.address);
            expect(balanceAfter).to.equal(initialAmount - burnAmount);
        });

        it("should decrease circulating supply when tokens are burned", async function () {
            const burnAmount = 100;
            const supplyBefore = await dogiToken.circulatingSupply();
            await dogiToken.connect(user1).eliminate(burnAmount);
            const supplyAfter = await dogiToken.circulatingSupply();
            expect(supplyAfter).to.equal(supplyBefore.sub(burnAmount));
        });
    });

    describe("sendToken", function () {
        beforeEach(async function () {
            await dogiToken.connect(admin).createToken(user1.address, initialAmount);
        });

        it("should transfer tokens correctly", async function () {
            const transferAmount = 100;
            await dogiToken.connect(user1).sendToken(user2.address, transferAmount);
            const balanceUser2 = await dogiToken.accountBalances(user2.address);
            expect(balanceUser2).to.equal(transferAmount);
        });

        it("should not allow transfers to the same address", async function () {
            const transferAmount = 100;
            await expect(dogiToken.connect(user1).sendToken(user1.address, transferAmount))
                .to.be.revertedWith("DogiToken: cannot transfer to the same address");
        });

        it("should not allow transfers if insufficient balance", async function () {
            const transferAmount = initialAmount + 1;
            await expect(dogiToken.connect(user1).sendToken(user2.address, transferAmount))
                .to.be.revertedWith("DogiToken: transfer amount exceeds balance");
        });
    });
});



/*
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Describe block for DogiToken contract tests
describe("DogiToken Tests", function () {
  let DogiToken, dogiToken, deployer, user;

  // Common setup before each test
  beforeEach(async function () {
    // Get the ContractFactory for DogiToken and initialize signers
    DogiToken = await ethers.getContractFactory("DogiToken");
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
*/