import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  ADDRESS_ZERO,
  deployContract,
  getTokenUrisFromReceipt,
  mintTokens,
} from '../utils/contract';

describe('Level Up', () => {
  it('Should level up the card', async () => {
    const zombiies = await deployContract();
    const [, player] = await ethers.getSigners();

    const tokenURIs = [
      'sample-token-uri',
      'sample-token-uri',
      'sample-token-uri',
    ];
    const proofURI = 'ipfs://proofURI';

    const sacrificeIds = (
      await mintTokens(zombiies, tokenURIs, player.address)
    ).slice(0, 2);

    const levelUpURI = 'ipfs://levelUpURI';
    const tx = await zombiies.levelUp(
      player.address,
      sacrificeIds,
      levelUpURI,
      proofURI
    );

    const receipt = await tx.wait();
    const lvUpEvent = receipt.events?.find((e) => e.event === 'LevelUp');
    expect(lvUpEvent).not.to.be.undefined;
    expect(lvUpEvent?.args?.proofURI).to.equal(proofURI);

    const newCardUris = await getTokenUrisFromReceipt(
      zombiies,
      receipt,
      (from, to) => to !== ADDRESS_ZERO
    );
    expect(newCardUris.length).to.eq(1);
    expect(newCardUris[0]).to.eq(levelUpURI);
  });

  it('Should revert if not enough sacrifices', async () => {
    const zombiies = await deployContract();
    const [, player] = await ethers.getSigners();

    const tokenURIs = [
      'sample-token-uri',
      'sample-token-uri',
      'sample-token-uri',
    ];
    const proofURI = 'ipfs://proofURI';

    const sacrificeIds = (
      await mintTokens(zombiies, tokenURIs, player.address)
    ).slice(0, 1);

    const levelUpURI = 'ipfs://levelUpURI';
    expect(
      zombiies.levelUp(player.address, sacrificeIds, levelUpURI, proofURI)
    ).to.revertedWith('Not enough sacrifices');
  });
});
