import { expect } from "chai";
import { ethers } from "hardhat";
import { deployTestContract } from "utils/contract";

describe("Auction", () => {
  it("Should start auction", async () => {
    const zombiies = await deployTestContract();
    const [owner, addr1] = await ethers.getSigners();
    const tokenURIs = ["uri-1", "uri-2", "uri-3", "uri-4"];
    const proofURI = "ipfs://proofURI";
    (await zombiies.buyStarterPack(addr1.address, tokenURIs, proofURI)).wait();

    const tokens = await zombiies.allTokensOf(addr1.address);
    const tokenToAuction = tokens[0];

    const tx = await zombiies
      .connect(addr1)
      .startAuction(addr1.address, tokenToAuction.id, proofURI);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e?.event === "AuctionStarted");
    expect(event?.args?.tokenId).to.equal(tokenToAuction.id);
    expect(event?.args?.proofURI).to.equal(proofURI);

    const token = (await zombiies.tokensByIds([tokenToAuction.id]))[0];
    expect(token.owner).to.eq(owner.address);
  });

  it("Should end auction", async () => {
    const zombiies = await deployTestContract();
    const [, addr1, winner] = await ethers.getSigners();
    const tokenURIs = ["uri-1", "uri-2", "uri-3", "uri-4"];
    const proofURI = "ipfs://proofURI";
    (await zombiies.buyStarterPack(addr1.address, tokenURIs, proofURI)).wait();

    const tokens = await zombiies.allTokensOf(addr1.address);
    const tokenToAuction = tokens[0];

    (
      await zombiies
        .connect(addr1)
        .startAuction(addr1.address, tokenToAuction.id, proofURI)
    ).wait();

    const tx = await zombiies.endAuction(
      winner.address,
      tokenToAuction.id,
      proofURI
    );
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e?.event === "AuctionEnded");
    expect(event?.args?.winner).to.equal(winner.address);

    const token = (await zombiies.tokensByIds([tokenToAuction.id]))[0];
    expect(token.owner).to.eq(winner.address);
  });
});
