import { expect } from 'chai';
import { ethers } from 'hardhat';
import { deployContract, getTokenUrisFromReceipt } from 'utils/contract';

describe('Safe mint', () => {
  it('Should mint new card', async () => {
    const zombiies = await deployContract();
    const [, player] = await ethers.getSigners();

    const tokenURI = 'ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u';
    const proofURI = 'ipfs://proof';
    const tx = await zombiies.safeMint(player.address, tokenURI, proofURI);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event === 'SafeMint');
    expect(event).to.not.null;

    const tokenUris = await getTokenUrisFromReceipt(zombiies, receipt);
    expect(tokenUris.length).to.eq(1);
    expect(tokenUris[0]).to.eq(tokenURI);
  });

  it('Should revert if not owner', async () => {
    const zombiies = await deployContract();
    const [, player] = await ethers.getSigners();

    const tokenURI = 'ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u';
    const proofURI = 'ipfs://proof';
    expect(
      zombiies.connect(player).safeMint(player.address, tokenURI, proofURI)
    ).to.revertedWith('Ownable: caller is not the owner');
  });
});
