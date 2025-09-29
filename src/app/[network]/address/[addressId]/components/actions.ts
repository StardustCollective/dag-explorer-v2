"use server";

import { getCurrentEpochProgress } from "@/queries";

export const getCurrentEpochProgress_Action: typeof getCurrentEpochProgress =
  async (network) => {
    return getCurrentEpochProgress(network);
  };
