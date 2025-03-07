export enum HgtpNetwork {
  MAINNET_1 = "mainnet1",
  MAINNET = "mainnet",
  INTEGRATIONNET = "integrationnet",
  TESTNET = "testnet",
}

export const isHgtpNetwork = (network: any): network is HgtpNetwork =>
  Object.values(HgtpNetwork).includes(network);
