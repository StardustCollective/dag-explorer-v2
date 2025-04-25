export enum HgtpNetwork {
  MAINNET = "mainnet",
  INTEGRATIONNET = "integrationnet",
  TESTNET = "testnet",
  MAINNET_1 = "mainnet1",
}

export const NetworkNames: Record<HgtpNetwork, string> = {
  [HgtpNetwork.MAINNET]: "Mainnet",
  [HgtpNetwork.INTEGRATIONNET]: "Integrationnet",
  [HgtpNetwork.TESTNET]: "Testnet",
  [HgtpNetwork.MAINNET_1]: "Mainnet (Old)",
};

export const isHgtpNetwork = (network: any): network is HgtpNetwork =>
  Object.values(HgtpNetwork).includes(network);

export const NetworkEpochInSeconds = 65;
