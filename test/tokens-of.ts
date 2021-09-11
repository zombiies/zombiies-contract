import { ethers } from 'hardhat';
import { expect } from 'chai';
import { deployContract, mintTokens } from '../utils/contract';

describe('Tokens of', () => {
  it('Should returns all tokens owned by the given address', async () => {
    const zombiies = await deployContract();
    const [, addr] = await ethers.getSigners();

    const tokenURIs = [
      'sample-token-uri',
      'sample-token-uri',
      'sample-token-uri',
    ];

    const tokenIds = await mintTokens(zombiies, tokenURIs, addr.address);
    const ownedTokens = await zombiies.tokensOf(addr.address);

    expect(ownedTokens.length).to.eq(tokenIds.length);
    expect(ownedTokens.every(({ id }) => tokenIds.some((tId) => tId.eq(id)))).to
      .be.true;

    expect(ownedTokens.every(({ uri }) => tokenURIs.includes(uri))).to.be.true;
  });
});
