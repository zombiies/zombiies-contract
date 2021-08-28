import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestContract } from "utils/contract";

describe("Award", () => {
  it("Should award new card", async () => {
    const zombiies = await deployTestContract();
    const [, player] = await ethers.getSigners();

    const tokenURI = "ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u";
    const proofURI = "ipfs://proof";
    const tx = await zombiies.award(player.address, tokenURI, proofURI);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event === "Awarded");
    expect(event?.args?.proofURI).to.eq(proofURI);
  });

  it("Should revert if not owner", async () => {
    const zombiies = await deployTestContract();
    const [, player] = await ethers.getSigners();

    const tokenURI = "ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u";
    const proofURI = "ipfs://proof";
    expect(
      zombiies.connect(player).award(player.address, tokenURI, proofURI)
    ).to.revertedWith("Ownable: caller is not the owner");
  });
});
