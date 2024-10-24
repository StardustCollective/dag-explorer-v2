import { HgtpNetwork } from '../constants';

const {
  REACT_APP_TESTNET_BE_URL,
  REACT_APP_MAINNET_TWO_BE_URL,
  REACT_APP_INTEGRATIONNET_TWO_BE_URL,
  REACT_APP_TESTNET_L0_NODE_URL,
  REACT_APP_MAINNET_TWO_L0_NODE_URL,
  REACT_APP_INTEGRATIONNET_TWO_L0_NODE_URL
} = process.env;

const beUrls = {
  testnet: REACT_APP_TESTNET_BE_URL,
  mainnet: REACT_APP_MAINNET_TWO_BE_URL,
  integrationnet: REACT_APP_INTEGRATIONNET_TWO_BE_URL,
};

const l0Urls = {
  testnet: REACT_APP_TESTNET_L0_NODE_URL,
  mainnet: REACT_APP_MAINNET_TWO_L0_NODE_URL,
  integrationnet: REACT_APP_INTEGRATIONNET_TWO_L0_NODE_URL,
};

export const getBEUrl = (network: HgtpNetwork): string => {
  return beUrls[network];
};

export const getL0Url = (network: HgtpNetwork): string => {
  return l0Urls[network];
};
