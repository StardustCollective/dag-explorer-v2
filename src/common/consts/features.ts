import { HgtpNetwork } from "./network";

/**
 * Features that are not available on every network, usually because they are
 * still being rolled out on the backend side.
 */
export type INetworkFeature = "increaseDelegatedStake";

export const NetworkFeatures: Record<
  HgtpNetwork,
  Record<INetworkFeature, boolean>
> = {
  [HgtpNetwork.MAINNET]: { increaseDelegatedStake: false },
  [HgtpNetwork.INTEGRATIONNET]: { increaseDelegatedStake: true },
  [HgtpNetwork.TESTNET]: { increaseDelegatedStake: true },
  [HgtpNetwork.MAINNET_1]: { increaseDelegatedStake: false },
};

export const isNetworkFeatureEnabled = (
  network: HgtpNetwork,
  feature: INetworkFeature
) => NetworkFeatures[network]?.[feature] ?? false;
