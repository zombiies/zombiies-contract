import { cleanEnv, str } from 'envalid';
import { ethers, upgrades } from 'hardhat';

async function main() {
  const { CONTRACT_ADDRESS } = cleanEnv(process.env, {
    CONTRACT_ADDRESS: str(),
  });

  const UpgradedZombiies = await ethers.getContractFactory('ZombiiesToken');
  const upgraded = await upgrades.upgradeProxy(
    CONTRACT_ADDRESS,
    UpgradedZombiies
  );

  console.info('Zombiies upgraded: ', upgraded.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
