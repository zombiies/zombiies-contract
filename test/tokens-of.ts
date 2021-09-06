import { ethers } from 'hardhat';
import { expect } from 'chai';
import { deployContract, getTokenIdsFromReceipt } from '../utils/contract';

describe('Tokens of', () => {
  it('Should returns all tokenIds owned by the given address', async () => {
    const zombiies = await deployContract();
    const [, addr] = await ethers.getSigners();

    const tokenURIs = [
      'sample-token-uri',
      'sample-token-uri',
      'sample-token-uri',
    ];
    const proofURI = 'ipfs://proofURI';
    const buyPackReceipt = await (
      await zombiies.buyStarterPack(addr.address, tokenURIs, proofURI)
    ).wait();

    const tokenIds = getTokenIdsFromReceipt(buyPackReceipt);
    const ownedTokenIds = await zombiies.tokensOf(addr.address);

    expect(ownedTokenIds.length).to.eq(tokenIds.length);
    expect(
      ownedTokenIds.every((ownedId) => tokenIds.some((id) => id.eq(ownedId)))
    ).to.be.true;
  });
});
