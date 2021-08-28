import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestContract } from "utils/contract";

describe("Get all tokens of an address", () => {
  it("Should return all tokens of an address", async () => {
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

    const allTokens = await zombiies.allTokensOf(addr1.address);
    allTokens.forEach((token, index) => {
      const { id, owner, uri } = token;
      expect(id).to.not.be.null;
      expect(owner).to.eq(addr1.address);
      expect(uri).to.eq(tokenURIs[index]);
    });
  });
});
