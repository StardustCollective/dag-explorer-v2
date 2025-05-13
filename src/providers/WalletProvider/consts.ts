import { HgtpNetwork } from "@/common/consts";

export const StargazerNetworkIds: Record<HgtpNetwork, string> = {
  [HgtpNetwork.MAINNET]: "1",
  [HgtpNetwork.TESTNET]: "3",
  [HgtpNetwork.INTEGRATIONNET]: "4",
  [HgtpNetwork.MAINNET_1]: "-1",
};

export const DelegatedStakingMinVersion = "5.2.1";
