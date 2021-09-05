import { expect } from 'chai';
import { ethers } from 'hardhat';
import { deployContract, getTokenIdsFromReceipt } from 'utils/contract';

describe('Auction', () => {
  it('Should start auction', async () => {
    const zombiies = await deployContract();
    const [owner, addr1] = await ethers.getSigners();
    const tokenURIs = ['uri-1', 'uri-2', 'uri-3', 'uri-4'];
    const proofURI = 'ipfs://proofURI';
    const buyPackReceipt = await (
      await zombiies.buyStarterPack(addr1.address, tokenURIs, proofURI)
    ).wait();
    const tokenIds = getTokenIdsFromReceipt(buyPackReceipt);
    const tokenIdToAuction = tokenIds[0];

    const tx = await zombiies
      .connect(addr1)
      .startAuction(addr1.address, tokenIdToAuction, proofURI);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e?.event === 'AuctionStarted');
    expect(event?.args?.proofURI).to.equal(proofURI);

    const returnedIds = getTokenIdsFromReceipt(receipt);
    expect(returnedIds.length).to.eq(1);
    expect(returnedIds[0]).to.eq(tokenIdToAuction);

    const ownerOfReturned = await zombiies.ownerOf(returnedIds[0]);
    expect(ownerOfReturned).to.equal(owner.address);
  });

  it('Should end auction', async () => {
    const zombiies = await deployContract();
    const [owner, addr1, winner] = await ethers.getSigners();
    const tokenURIs = ['uri-1', 'uri-2', 'uri-3', 'uri-4'];
    const proofURI = 'ipfs://proofURI';

    const buyPackReceipt = await (
      await zombiies.buyStarterPack(addr1.address, tokenURIs, proofURI)
    ).wait();
    const tokenIds = getTokenIdsFromReceipt(buyPackReceipt);
    const tokenIdToAuction = tokenIds[0];

    await (
      await zombiies
        .connect(addr1)
        .startAuction(addr1.address, tokenIdToAuction, proofURI)
    ).wait();

    expect(await zombiies.ownerOf(tokenIdToAuction)).to.eq(owner.address);

    const tx = await zombiies.endAuction(
      winner.address,
      tokenIdToAuction,
      proofURI
    );
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e?.event === 'AuctionEnded');
    expect(event?.args?.proofURI).to.equal(proofURI);

    const returnedIds = getTokenIdsFromReceipt(receipt);
    expect(returnedIds.length).to.eq(1);

    expect(returnedIds[0]).to.eq(tokenIdToAuction);
    expect(await zombiies.ownerOf(tokenIdToAuction)).to.eq(winner.address);
  });
});