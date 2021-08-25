import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, upgrades } from "hardhat";
import { ZombiiesToken } from "../typechain/ZombiiesToken";

describe("Award Token", () => {
  it("Should mints new token", async () => {
    const ZombiiesTokenContract = await ethers.getContractFactory(
      "ZombiiesToken"
    );
    const proxy = await upgrades.deployProxy(ZombiiesTokenContract);
    const zombiies = (await proxy.deployed()) as ZombiiesToken;

    const [, addrToAward] = await ethers.getSigners();
    expect(await zombiies.balanceOf(addrToAward.address)).to.equal(
      BigNumber.from(0)
    );

    const tokenURI = "sample-token-uri";
    const awardTx = await zombiies.safeMint(addrToAward.address, tokenURI);
    await awardTx.wait();

    expect(await zombiies.balanceOf(addrToAward.address)).to.equal(
      BigNumber.from(1)
    );

    const newTokenId = await zombiies.tokenOfOwnerByIndex(
      addrToAward.address,
      0
    );
    const receivedTokenURI = await zombiies.tokenURI(newTokenId);

    expect(receivedTokenURI).to.equal(tokenURI);
  });

  it("Should not mint new token if not owner", async () => {
    const ZombiiesTokenContract = await ethers.getContractFactory(
      "ZombiiesToken"
    );
    const proxy = await upgrades.deployProxy(ZombiiesTokenContract);
    const zombiies = (await proxy.deployed()) as ZombiiesToken;

    const [, notOwner, addrToAward] = await ethers.getSigners();
    expect(
      zombiies.connect(notOwner).safeMint(addrToAward.address, "token-uri")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
