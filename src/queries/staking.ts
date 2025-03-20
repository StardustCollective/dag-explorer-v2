import { mock_getAddressStakingDelegations, mock_getStakingDelegators } from "./_mocks/staking";

import { L0NodesAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { ISearchOptions } from "@/types";
import { IStakingAddress, IStakingDelegator } from "@/types/staking";

export const getStakingDelegators = async (
  network: HgtpNetwork,
  options?: ISearchOptions
): Promise<IStakingDelegator[]> => {
  return mock_getStakingDelegators(network, options); // @todo remove mock

  const response = await L0NodesAPI[network].get<IStakingDelegator[]>(
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
): Promise<IStakingAddress> => {
  return mock_getAddressStakingDelegations(network, address); // @todo remove mock

  const response = await L0NodesAPI[network].get<IStakingAddress>(
    `/delegated-stake/${address}/info`
  );

  return response.data;
};
