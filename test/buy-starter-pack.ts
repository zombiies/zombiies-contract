import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { deployContract, getTokenUrisFromReceipt } from 'utils/contract';

describe('Buy starter pack', () => {
  it('Should mints new tokens in starter pack', async () => {
    const zombiies = await deployContract();
    const [, buyer] = await ethers.getSigners();

    expect(await zombiies.balanceOf(buyer.address)).to.equal(BigNumber.from(0));

    const tokenURIs = ['sample-token-uri-1', 'sample-token-uri-2'];
    const proofURI = 'ipfs://proofURI';
    const awardTx = await zombiies.buyStarterPack(
      buyer.address,
      tokenURIs,
      proofURI
    );
    const receipt = await awardTx.wait();

    expect(await zombiies.balanceOf(buyer.address)).to.equal(
      BigNumber.from(tokenURIs.length)
    );

    const returnedUris = await getTokenUrisFromReceipt(zombiies, receipt);
    expect(returnedUris.length).to.eq(tokenURIs.length);
    expect(
      returnedUris.every((returned) =>
        tokenURIs.some((uri) => returned === uri)
      )
    ).to.be.true;

    const starterPackBoughtEvent = receipt.events?.find(
      (e) => e.event === 'StarterPackBought'
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

    const { proofURI: returnedProofURI } = args;
    expect(returnedProofURI).to.eq(proofURI);
  });
});
