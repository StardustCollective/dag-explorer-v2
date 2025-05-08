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

export const DelegatedStakeNetworkLockHours: Record<HgtpNetwork, number> = {
  [HgtpNetwork.MAINNET]: 21 * 24, // 21 Days
  [HgtpNetwork.INTEGRATIONNET]: 1 * 24, // 1 Day
  [HgtpNetwork.TESTNET]: 1, // 1 Hour
  [HgtpNetwork.MAINNET_1]: 21 * 24, // 21 Days
};
