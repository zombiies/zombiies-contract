import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { ZombiiesToken } from "../typechain/ZombiiesToken.d";

describe("Award Token", () => {
  it("Should mints new token", async () => {
    const ZombiiesTokenContract = await ethers.getContractFactory(
      "ZombiiesToken"
    );
    const zombiies = (await ZombiiesTokenContract.deploy()) as ZombiiesToken;

    const [, addrToAward] = await ethers.getSigners();
    expect(await zombiies.balanceOf(addrToAward.address)).to.equal(
      BigNumber.from(0)
    );

    const tokenURI = "sample-token-uri";
    const awardTx = await zombiies.awardToken(addrToAward.address, tokenURI);
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
    const zombiies = (await ZombiiesTokenContract.deploy()) as ZombiiesToken;

    const [, notOwner, addrToAward] = await ethers.getSigners();
    expect(
      zombiies.connect(notOwner).awardToken(addrToAward.address, "token-uri")
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});
