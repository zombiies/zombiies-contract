import { BigNumber } from '@ethersproject/bignumber';
import { expect } from 'chai';
import { deployContract } from '../utils/contract';

describe('Mint Fee', () => {
  it('Should set the mint fee', async () => {
    const zombiies = await deployContract();
    const fee = BigNumber.from(1);
    const tx = await zombiies.setMintFee(fee);
    const receipt = await tx.wait();

    const { events } = receipt;
    expect(events).to.have.lengthOf(1);

    if (!events) {
      return;
    }

    const { event } = events[0];
    expect(event).to.equal('MintFeeChanged');
    expect(events[0].args).to.have.property('newFee');

    if (!events[0].args) {
      return;
    }

    const { newFee } = events[0].args;
    expect(newFee.toString()).to.equal(fee.toString());

    expect(await zombiies.getMintFee()).to.equal(fee);
  });
});
