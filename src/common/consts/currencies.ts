import Decimal from "decimal.js";

export const KnownCoinIds: Record<string, string> = {
  native: "constellation-labs",
  DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM: "dor",
};

export const DagDecimals = 8;

export const DagBaseFactor = Decimal.pow(10, DagDecimals);