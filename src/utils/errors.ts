import { isAxiosError } from "axios";

export class UserError extends Error {
  skipSentryReporting = true;
}

export class MaintenanceError extends Error {
  skipSentryReporting = true;
  digest: string;

  constructor() {
    super();
    this.name = "MaintenanceError";
    this.digest = this.name;
  }
}

export const isMaintenanceError = (error: unknown) => {
  if (String(error).includes("MaintenanceError")) {
    return true;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String(error.digest).includes("MaintenanceError")
  ) {
    return true;
  }

  if (!isAxiosError(error)) {
    return false;
  }

  if (error.status !== 503) {
    return false;
  }

  if (!JSON.stringify(error.response?.data).includes("maintenance")) {
    return false;
  }

  return true;
};

export class ClusterUpgradeError extends Error {
  skipSentryReporting = true;
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
