import { dag4 } from "@stardust-collective/dag4";
import { cache } from "react";

import { getAddressActions } from "./addresses";

import { DagExplorerAPI, L0NodesAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { IAPIResponse, ISearchOptions } from "@/types";
import {
  IAPIMetagraphStakingNode,
  IAPIStakingDelegator,
  IL0StakingAddress,
  IL0StakingDelegation,
  IL0StakingDelegator,
} from "@/types/staking";
import { IWaitForPredicate, waitForPredicate } from "@/utils";
import { isClusterUpgradeError } from "@/utils/errors";

export const getDelegatorsMetagraphs = cache(
  async (
    network: HgtpNetwork,
    nodeIds: string[]
  ): Promise<IAPIMetagraphStakingNode[]> => {
    if ([HgtpNetwork.MAINNET_1, HgtpNetwork.MAINNET].includes(network)) {
      return [];
    }

    const response = await DagExplorerAPI.get<
      IAPIResponse<IAPIMetagraphStakingNode[]>
    >(`/${network}/delegators/metagraphs`, {
      params: { delegators: nodeIds.map((id) => id.slice(0, 10)).join(",") },
    });

    return response.data.data;
  }
);

export const getStakingDelegators = cache(
  async (
    network: HgtpNetwork,
    options?: ISearchOptions
  ): Promise<IAPIStakingDelegator[]> => {
    if ([HgtpNetwork.MAINNET_1, HgtpNetwork.MAINNET].includes(network)) {
      return [];
    }

    try {
      const { data: validators } = await L0NodesAPI[network].get<
        IL0StakingDelegator[]
      >(`/node-params`, {
        params: { ...options?.search },
      });

      const validatorsMetagraphs = await getDelegatorsMetagraphs(
        network,
        validators.map((v) => v.peerId)
      );

      return validators
        .map((validator) => ({
          ...validator,
          nodeIdAddress: dag4.keyStore.getDagAddressFromPublicKey(
            validator.peerId
          ),
          metagraphNode: validatorsMetagraphs.find(
            (v) => v.nodeId === validator.peerId
          ),
        }))
        .sort((a, b) => b.totalAmountDelegated - a.totalAmountDelegated);
    } catch (e) {
      if (isClusterUpgradeError(e)) {
        throw new Error("ClusterUpgradeError");
      }

      throw e;
    }
  }
);

export const getAddressStakingDelegations = async (
  network: HgtpNetwork,
  address: string
): Promise<IL0StakingDelegation[]> => {
  if ([HgtpNetwork.MAINNET_1, HgtpNetwork.MAINNET].includes(network)) {
    return [];
  }

  const response = await L0NodesAPI[network].get<IL0StakingAddress>(
    `/delegated-stakes/${address}/info`
  );

  return response.data.activeDelegatedStakes;
};

export const confirmAddressTokenLock = async (
  network: HgtpNetwork,
  address: string,
  hash: string,
  metagraphId?: string,
  options?: IWaitForPredicate
) => {
  return waitForPredicate(async () => {
    const actions = await getAddressActions(network, address, metagraphId);
    return actions.records.some(
      (d) => d.type === "TokenLock" && d.hash === hash
    );
  }, options);
};

export const confirmAddressDelegatedStake = async (
  network: HgtpNetwork,
  address: string,
  hash: string,
  options?: IWaitForPredicate
) => {
  return waitForPredicate(async () => {
    const delegations = await getAddressStakingDelegations(network, address);
    return delegations.some((d) => d.hash === hash);
  }, options);
};
