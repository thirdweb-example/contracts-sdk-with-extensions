const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    // Get a signer to use for testing
    const [testAccount] = await ethers.getSigners();

    // Deploy the contract
    const nftContractFactory = await hre.ethers.getContractFactory(
      "MyAwesomeNft"
    );
    const nftContract = await nftContractFactory.deploy(
      "name",
      "symbol",
      testAccount.address,
      500
    );
    await nftContract.deployed();

    // Mint an NFT to the test account
    const mintTx = await nftContract.mintTo(
      testAccount.address,
      "test metadata"
    );
    await mintTx.wait();
    const bal = await nftContract.balanceOf(testAccount.address);

    // The user should now have an NFT
    expect(bal).to.equal(1);
  });
});
