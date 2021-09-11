import { ethers } from 'hardhat';
import { expect } from 'chai';
import { deployContract, mintTokens } from '../utils/contract';

describe('Tokens in', () => {
  it('Should returns all tokens with specific ids', async () => {
    const zombiies = await deployContract();
    const [, addr] = await ethers.getSigners();

    const tokenURIs = [
      'sample-token-uri',
      'sample-token-uri',
      'sample-token-uri',
    ];
    const tokenIds = await mintTokens(zombiies, tokenURIs, addr.address);

    const ownedTokens = await zombiies.tokensOf(addr.address);

    const tokenIdsToGet = tokenIds.slice(0, 2);
    const tokens = await zombiies.tokensIn(tokenIdsToGet);

    expect(tokens.length).to.be.equal(2);
    expect(
      tokens.every((token) =>
        ownedTokens.some(({ id, uri }) => token.id.eq(id) && token.uri === uri)
      )
    ).to.be.true;
  });
});
