import { expect } from "chai";
import { deployContract } from "utils/contract";

describe("Factory URI", () => {
  it("Should set the factory URI", async () => {
    const zombiies = await deployContract();
    const uri = "New URI";
    const tx = await zombiies.setFactoryURI(uri);
    const receipt = await tx.wait();

    const { events } = receipt;
    expect(events).to.have.lengthOf(1);

    if (!events) {
      return;
    }

    const { event } = events[0];
    expect(event).to.equal("FactoryURIChanged");
    expect(events[0].args).to.have.property("newURI", uri);
    expect(await zombiies.getFactoryURI()).to.equal(uri);
  });
});
