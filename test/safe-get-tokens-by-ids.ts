import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { deployTestContract } from "utils/contract";

describe("Get tokens by an ids array without revert if any id is not found", () => {
  it("Should return tokens by ids", async () => {
    const zombiies = await deployTestContract();
    const [, addr1] = await ethers.getSigners();
    const tokenURIs = ["uri-1", "uri-2", "uri-3", "uri-4"];
    const proofURI = "ipfs://proofURI";

    expect(await zombiies.allTokensOf(addr1.address)).to.be.empty;

    const awardTx = await zombiies.buyStarterPack(
      addr1.address,
      tokenURIs,
      proofURI
    );
    await awardTx.wait();

    const addr1Tokens = await zombiies.allTokensOf(addr1.address);
    const ids = addr1Tokens.map((token) => token.id);

    const tokensByIds = await zombiies.safeGetTokensById(ids);
    expect(tokensByIds).to.have.lengthOf(ids.length);
    expect(ids.every((id) => tokensByIds.some((token) => token.id.eq(id)))).to
      .be.true;
  });

  it("Should return tokens by ids array ignore not found ids", async () => {
    const zombiies = await deployTestContract();
    const [, addr1] = await ethers.getSigners();
    const tokenURIs = ["uri-1", "uri-2", "uri-3", "uri-4"];
    const proofURI = "ipfs://proofURI";

    expect(await zombiies.allTokensOf(addr1.address)).to.be.empty;

    const awardTx = await zombiies.buyStarterPack(
      addr1.address,
      tokenURIs,
      proofURI
    );
    await awardTx.wait();

    const addr1Tokens = await zombiies.allTokensOf(addr1.address);
    const ids = addr1Tokens.map((token) => token.id);
    const wrongIds = ids.concat(BigNumber.from(999));

    const tokensByIds = await zombiies.safeGetTokensById(wrongIds);
    expect(tokensByIds).to.have.lengthOf(ids.length);
    expect(ids.every((id) => tokensByIds.some((token) => token.id.eq(id)))).to
      .be.true;
  });
});
