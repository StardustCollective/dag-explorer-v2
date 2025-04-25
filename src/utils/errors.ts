import { isAxiosError } from "axios";

export const isClusterUpgradeError = (error: unknown) => {
  if (String(error).includes("ClusterUpgradeError")) {
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
