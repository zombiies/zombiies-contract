import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { deployTestContract } from "utils/contract";

describe("Buy starter pack", () => {
  it("Should mints new tokens in starter pack", async () => {
    const zombiies = await deployTestContract();
    const [, buyer] = await ethers.getSigners();

    expect(await zombiies.balanceOf(buyer.address)).to.equal(BigNumber.from(0));
    const starterPackFee = await zombiies.getStarterPackFee();

    const tokenURIs = ["sample-token-uri"];
    const awardTx = await zombiies.buyStarterPack(buyer.address, tokenURIs, {
      value: starterPackFee,
    });
    const receipt = await awardTx.wait();

    expect(await zombiies.balanceOf(buyer.address)).to.equal(
      BigNumber.from(tokenURIs.length)
    );

    const starterPackBoughtEvent = receipt.events?.find(
      (e) => e.event === "StarterPackBought"
    );

    expect(starterPackBoughtEvent).to.exist;
    if (!starterPackBoughtEvent) {
      return;
    }

    const { args } = starterPackBoughtEvent;
    expect(args).to.exist;
    if (!args) {
      return;
    }

    const { buyer: buyerAddress, tokenIds } = args;

    expect(buyerAddress).to.eq(buyer.address);

    const tokens = await zombiies.tokensByIds(tokenIds);
    const receivedTokenURIs = tokens.map((token) => token.uri);
    expect(receivedTokenURIs.length).to.equal(tokenURIs.length);

    expect(tokenURIs.every((uri, i) => receivedTokenURIs[i] === uri)).to.be
      .true;
  });

  it("Should fail to buy starter pack if not enough ether", async () => {
    const zombiies = await deployTestContract();
    const [, buyer] = await ethers.getSigners();

    const starterPackFee = await zombiies.getStarterPackFee();

    const tokenURIs = ["sample-token-uri"];
    expect(
      zombiies.buyStarterPack(buyer.address, tokenURIs, {
        value: starterPackFee.sub(1),
      })
    ).to.revertedWith("Not enough fee");
  });
});
