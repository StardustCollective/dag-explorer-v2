import axios, { AxiosInstance } from "axios";

import { HgtpNetwork } from "./consts";

import { DeploymentStage, EnvironmentContext } from "@/runtime";

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
  [HgtpNetwork.MAINNET]: axios.create({
    baseURL: `https://l0-lb-mainnet.constellationnetwork.io`,
  }),
  [HgtpNetwork.INTEGRATIONNET]: axios.create({
    baseURL: `https://l0-lb-integrationnet.constellationnetwork.io`,
  }),
  [HgtpNetwork.TESTNET]: axios.create({
    baseURL: `https://l0-lb-testnet.constellationnetwork.io`,
  }),
  [HgtpNetwork.MAINNET_1]: axios.create({
    baseURL: `https://l0-lb-mainnet.constellationnetwork.io`,
  }),
};
