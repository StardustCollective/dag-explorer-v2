export enum HgtpNetwork {
  MAINNET_1 = "mainnet1",
  MAINNET = "mainnet",
  INTEGRATIONNET = "integrationnet",
  TESTNET = "testnet",
}

export const NetworkNames: Record<HgtpNetwork, string> = {
  [HgtpNetwork.MAINNET_1]: "Mainnet 1.0",
  [HgtpNetwork.MAINNET]: "Mainnet 2.0",
  [HgtpNetwork.INTEGRATIONNET]: "Integrationnet 2.0",
  [HgtpNetwork.TESTNET]: "Testnet 2.0",
};

export const isHgtpNetwork = (network: any): network is HgtpNetwork =>
  Object.values(HgtpNetwork).includes(network);
