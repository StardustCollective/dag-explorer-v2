import {
  mock_getAddressStakingDelegations,
  mock_getStakingDelegators,
} from "./_mocks/staking";

import { L0NodesAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { ISearchOptions } from "@/types";
import {
  IL0StakingDelegation,
  IL0StakingDelegator,
} from "@/types/staking";

export const getStakingDelegators = async (
  network: HgtpNetwork,
  options?: ISearchOptions
): Promise<IL0StakingDelegator[]> => {
  return mock_getStakingDelegators(network, options); // @todo remove mock

  const response = await L0NodesAPI[network].get<IL0StakingDelegator[]>(
    `/node-params`,
    {
      params: { ...options?.search },
    }
  );

  return response.data;
};

export const getAddressStakingDelegations = async (
  network: HgtpNetwork,
  address: string
): Promise<IL0StakingDelegation[]> => {
  const response = await mock_getAddressStakingDelegations(network, address); // @todo remove mock

  return [...response.activeDelegatedStakes, ...response.pendingWithdrawals];

  // const response = await L0NodesAPI[network].get<IL0StakingAddress>(
  //   `/delegated-stake/${address}/info`
  // );

  // return response.data;
};
