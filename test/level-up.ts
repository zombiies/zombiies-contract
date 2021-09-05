import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  ADDRESS_ZERO,
  deployContract,
  getTokenIdsFromReceipt,
  getTokenUrisFromReceipt,
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
    const buyPackReceipt = await (
      await zombiies.buyStarterPack(player.address, tokenURIs, proofURI)
    ).wait();
    await (await zombiies.setCountToLevelUp(3)).wait();

    const sacrificeIds = getTokenIdsFromReceipt(buyPackReceipt);

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
    const buyPackReceipt = await (
      await zombiies.buyStarterPack(player.address, tokenURIs, proofURI)
    ).wait();
    await (await zombiies.setCountToLevelUp(4)).wait();

    const sacrificeIds = getTokenIdsFromReceipt(buyPackReceipt);

    const levelUpURI = 'ipfs://levelUpURI';
    expect(
      zombiies.levelUp(player.address, sacrificeIds, levelUpURI, proofURI)
    ).to.revertedWith('Not enough sacrifices');
  });
});
