import { isAxiosError } from "axios";

export class ClusterUpgradeError extends Error {
  digest: string;

  constructor() {
    super();
    this.name = "ClusterUpgradeError";
    this.digest = this.name;
  }
}

export const isClusterUpgradeError = (error: unknown) => {
  if (String(error).includes("ClusterUpgradeError")) {
    return true;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String(error.digest).includes("ClusterUpgradeError")
  ) {
    return true;
  }

  if (!isAxiosError(error)) {
    return false;
  }

  if (error.status !== 503) {
    return false;
  }

  if (!JSON.stringify(error.response?.data).includes("cluster upgrade")) {
    return false;
  }

  return true;
};
