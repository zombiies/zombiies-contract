import { expect } from "chai";
import { ethers } from "hardhat";
import { ZombiiesToken } from "../typechain/ZombiiesToken.d";

describe("Get all tokens of an address", () => {
  it("Should return all tokens of an address", async () => {
    const ZombiiesTokenContract = await ethers.getContractFactory(
      "ZombiiesToken"
    );
    const zombiies = (await ZombiiesTokenContract.deploy()) as ZombiiesToken;

    const [, addrToAward] = await ethers.getSigners();

    const tokenURIsToAward = ["uri-1", "uri-2", "uri-3", "uri-4"];

    expect(await zombiies.allTokensOf(addrToAward.address)).to.be.empty;

    await Promise.all(
      tokenURIsToAward.map(async (uri) => {
        const awardTx = await zombiies.awardToken(addrToAward.address, uri);
        await awardTx.wait();
      })
    );

    const allTokens = await zombiies.allTokensOf(addrToAward.address);
    allTokens.forEach((token, index) => {
      const { id, owner, uri } = token;
      expect(id).to.not.be.null;
      expect(owner).to.eq(addrToAward.address);
      expect(uri).to.eq(tokenURIsToAward[index]);
    });
  });
});
