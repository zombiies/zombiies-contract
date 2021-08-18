import { expect } from "chai";
import { ethers } from "hardhat";
import { Greeter } from "../typechain/Greeter.d";

describe("Greeter", () => {
  it("Should return the new greeting once it's changed", async () => {
    const GreeterContract = await ethers.getContractFactory("Greeter");
    const greeter = (await GreeterContract.deploy("Hello, world!")) as Greeter;
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
