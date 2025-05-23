import axios, { AxiosInstance } from "axios";

import { HgtpNetwork } from "./consts";

import { DeploymentStage, EnvironmentContext } from "@/runtime";
import { addRetryBehavior } from "@/utils/axios";

export const DagExplorerAPI = axios.create({
  baseURL: `https://${
    EnvironmentContext.stage === DeploymentStage.PRODUCTION
      ? "production"
      : "staging"
  }.dagexplorer-api.constellationnetwork.net`,
});

export const ConstellationEcosystemAPI = axios.create({
  baseURL: `https://${
    EnvironmentContext.stage === DeploymentStage.PRODUCTION
      ? "production"
      : "staging"
  }.ecosystem-api.constellationnetwork.net`,
});

export const BlockExplorerAPI: Record<HgtpNetwork, AxiosInstance> = {
  [HgtpNetwork.MAINNET]: axios.create({
    baseURL: `https://be-mainnet.constellationnetwork.io`,
  }),
  [HgtpNetwork.INTEGRATIONNET]: axios.create({
    baseURL: `https://be-integrationnet.constellationnetwork.io`,
  }),
  [HgtpNetwork.TESTNET]: axios.create({
    baseURL: `https://be-testnet.constellationnetwork.io`,
  }),
  [HgtpNetwork.MAINNET_1]: axios.create({
    baseURL: `https://block-explorer.constellationnetwork.io`,
  }),
};

export const L0NodesAPI: Record<HgtpNetwork, AxiosInstance> = {
  [HgtpNetwork.MAINNET]: addRetryBehavior(
    axios.create({
      baseURL: `https://l0-lb-mainnet.constellationnetwork.io`,
      timeout: 3 * 1000,
    })
  ),
  [HgtpNetwork.INTEGRATIONNET]: addRetryBehavior(
    axios.create({
      baseURL: `https://l0-lb-integrationnet.constellationnetwork.io`,
      timeout: 3 * 1000,
    })
  ),
  [HgtpNetwork.TESTNET]: addRetryBehavior(
    axios.create({
      baseURL: `https://l0-lb-testnet.constellationnetwork.io`,
      timeout: 3 * 1000,
    })
  ),
  [HgtpNetwork.MAINNET_1]: addRetryBehavior(
    axios.create({
      baseURL: `https://l0-lb-mainnet.constellationnetwork.io`,
      timeout: 3 * 1000,
    })
  ),
};
