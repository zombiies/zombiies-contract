import { ethers, upgrades } from "hardhat";
import { ZombiiesToken } from "../typechain/ZombiiesToken";

export const deployContract = async (): Promise<ZombiiesToken> => {
  const ZombiiesTokenContract = await ethers.getContractFactory(
    "ZombiiesToken"
  );
  const proxy = await upgrades.deployProxy(ZombiiesTokenContract);

  return (await proxy.deployed()) as ZombiiesToken;
};
