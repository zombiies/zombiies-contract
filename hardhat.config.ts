import 'tsconfig-paths/register';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-abi-exporter';
import { HardhatUserConfig } from 'hardhat/config';
import { config as dotEnvConfig } from 'dotenv';
import { cleanEnv, str } from 'envalid';

dotEnvConfig();

const { API_URL, PRIVATE_KEY } = cleanEnv(process.env, {
  API_URL: str(),
  PRIVATE_KEY: str(),
});

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
  },
  networks: {
    hardhat: {},
    testnet: {
      url: API_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
