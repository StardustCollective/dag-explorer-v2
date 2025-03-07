import { DeploymentStage, EnvironmentContext } from "@/runtime";
import axios from "axios";

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