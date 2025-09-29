"use server";

import { getCurrentEpochProgress, getStakingDelegators } from "@/queries";

export const getStakingDelegators_Action: typeof getStakingDelegators = async (
  network,
  options
) => {
  return getStakingDelegators(network, options);
};


export const getCurrentEpochProgress_Action: typeof getCurrentEpochProgress = async (
  network
) => {
  return getCurrentEpochProgress(network);
};