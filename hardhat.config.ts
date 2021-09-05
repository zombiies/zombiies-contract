import 'tsconfig-paths/register';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-abi-exporter';

import { HardhatUserConfig, task } from 'hardhat/config';

import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  accounts.forEach(async (account) => console.log(await account.address));
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const { API_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
  },
  networks: {
    hardhat: {},
    rinkeby: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

export default config;
