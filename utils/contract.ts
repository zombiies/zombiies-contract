import { ethers, upgrades } from 'hardhat';
import { BigNumber, ContractReceipt, Event } from 'ethers';
import { ZombiiesToken } from '../typechain';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

type GetMiddleware = (from: string, to: string) => boolean;

export const deployContract = async (): Promise<ZombiiesToken> => {
  const ZombiiesTokenContract = await ethers.getContractFactory(
    'ZombiiesToken'
  );
  const proxy = await upgrades.deployProxy(ZombiiesTokenContract);

  return (await proxy.deployed()) as ZombiiesToken;
};

export const getTokenIdsFromReceipt = (
  receipt: ContractReceipt,
  middleware?: GetMiddleware
): BigNumber[] => {
  const events: Event[] = receipt.events || [];

  return events
    .filter((e) => e.event === 'Transfer')
    .map((e) => {
      const { args } = e;

      if (!args) {
        return undefined;
      }

      const { from, to, tokenId } = args;

      if (middleware && !middleware(from, to)) {
        return undefined;
      }

      return tokenId;
    })
    .filter((id) => typeof id !== 'undefined');
};

export const getTokenUrisFromTokenIds = async (
  contract: ZombiiesToken,
  ids: BigNumber[]
): Promise<string[]> =>
  Promise.all(ids.map(async (id) => contract.tokenURI(id)));

export const getTokenUrisFromReceipt = async (
  contract: ZombiiesToken,
  receipt: ContractReceipt,
  middleware?: GetMiddleware
): Promise<string[]> =>
  getTokenUrisFromTokenIds(
    contract,
    getTokenIdsFromReceipt(receipt, middleware)
  );

export const mintTokens = async (
  contract: ZombiiesToken,
  tokenUris: string[],
  toAddress: string
): Promise<BigNumber[]> => {
  const tokenIds = [];

  // @dev: Must use `for await` to avoid error code -32000
  // eslint-disable-next-line no-restricted-syntax
  for (const tokenUri of tokenUris) {
    // eslint-disable-next-line no-await-in-loop
    const receipt = await (
      // eslint-disable-next-line no-await-in-loop
      await contract.safeMint(toAddress, tokenUri, 'Test')
    ).wait();
    tokenIds.push(...getTokenIdsFromReceipt(receipt));
  }

  return tokenIds;
};
