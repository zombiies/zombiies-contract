import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, upgrades } from "hardhat";
import { ZombiiesToken } from "../typechain/ZombiiesToken";

describe("Get tokens by an ids array", () => {
  it("Should return tokens by ids array", async () => {
    const ZombiiesTokenContract = await ethers.getContractFactory(
      "ZombiiesToken"
    );
    const proxy = await upgrades.deployProxy(ZombiiesTokenContract);
    const zombiies = (await proxy.deployed()) as ZombiiesToken;

    const [, addr1] = await ethers.getSigners();

    const tokenURIsToAward = ["uri-1", "uri-2", "uri-3", "uri-4"];

    expect(await zombiies.allTokensOf(addr1.address)).to.be.empty;

    await Promise.all(
      tokenURIsToAward.map(async (uri) => {
        const awardTx = await zombiies.safeMint(addr1.address, uri);
        await awardTx.wait();
      })
    );

    const addr1Tokens = await zombiies.allTokensOf(addr1.address);
    const ids = addr1Tokens.map((token) => token.id);

    const tokensByIds = await zombiies.tokensByIds(ids);
    expect(tokensByIds).to.have.lengthOf(ids.length);
    expect(ids.every((id) => tokensByIds.some((token) => token.id.eq(id)))).to
      .be.true;
  });

  it("Should revert if any id is not found", async () => {
    const ZombiiesTokenContract = await ethers.getContractFactory(
      "ZombiiesToken"
    );
    const proxy = await upgrades.deployProxy(ZombiiesTokenContract);
    const zombiies = (await proxy.deployed()) as ZombiiesToken;

    const [, addr1] = await ethers.getSigners();

    const tokenURIsToAward = ["uri-1", "uri-2", "uri-3", "uri-4"];

    expect(await zombiies.allTokensOf(addr1.address)).to.be.empty;

    await Promise.all(
      tokenURIsToAward.map(async (uri) => {
        const awardTx = await zombiies.safeMint(addr1.address, uri);
        await awardTx.wait();
      })
    );

    const addr1Tokens = await zombiies.allTokensOf(addr1.address);
    const ids = addr1Tokens
      .map((token) => token.id)
      .concat(BigNumber.from(999));

    expect(zombiies.tokensByIds(ids)).to.revertedWith(
      "ERC721: owner query for nonexistent token"
    );
  });
});
