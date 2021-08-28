import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestContract } from "utils/contract";

describe("Level Up", () => {
  it("Should level up the card", async () => {
    const zombiies = await deployTestContract();
    const [, player] = await ethers.getSigners();

    const tokenURIs = [
      "sample-token-uri",
      "sample-token-uri",
      "sample-token-uri",
    ];
    const proofURI = "ipfs://proofURI";
    (await zombiies.buyStarterPack(player.address, tokenURIs, proofURI)).wait();
    (await zombiies.setCountToLevelUp(3)).wait();

    const sacrifices = await zombiies.allTokensOf(player.address);

    const levelUpURI = "ipfs://levelUpURI";
    const tx = await zombiies.levelUp(
      player.address,
      sacrifices.map((s) => s.id),
      levelUpURI,
      proofURI
    );

    const receipt = await tx.wait();
    const lvUpEvent = receipt.events?.find((e) => e.event === "LevelUp");
    expect(lvUpEvent).not.to.be.undefined;
    expect(lvUpEvent?.args?.proofURI).to.equal(proofURI);
  });

  it("Should revert if not enough sacrifices", async () => {
    const zombiies = await deployTestContract();
    const [, player] = await ethers.getSigners();

    const tokenURIs = [
      "sample-token-uri",
      "sample-token-uri",
      "sample-token-uri",
    ];
    const proofURI = "ipfs://proofURI";
    (await zombiies.buyStarterPack(player.address, tokenURIs, proofURI)).wait();
    (await zombiies.setCountToLevelUp(4)).wait();

    const sacrifices = await zombiies.allTokensOf(player.address);

    const levelUpURI = "ipfs://levelUpURI";
    expect(
      zombiies.levelUp(
        player.address,
        sacrifices.map((s) => s.id),
        levelUpURI,
        proofURI
      )
    ).to.revertedWith("Not enough sacrifices");
  });
});
