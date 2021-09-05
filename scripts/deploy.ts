import { deployContract } from 'utils/contract';

async function main() {
  const zombiies = await deployContract();

  console.info('Zombiies deployed to:', zombiies.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
