import { dag4 } from "@stardust-collective/dag4";
import { AxiosInstance, isAxiosError } from "axios";
import { cache } from "react";

import { getActionTransaction } from "./actions";

import { DagExplorerAPI, L0NodesAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { ActionTransactionType, IAPIResponse, ISearchOptions } from "@/types";
import {
  IAPIMetagraphStakingNode,
  IAPIStakingDelegator,
  IL0StakingAddress,
  IL0StakingDelegation,
  IL0StakingDelegator,
} from "@/types/staking";
import {
  IWaitForPredicate,
  ParallelExecution,
  processBatchedArray,
  waitForPredicate,
} from "@/utils";
import { addCacheBehavior } from "@/utils/axios";
import { ClusterUpgradeError, isClusterUpgradeError } from "@/utils/errors";

export const getDelegatorsMetagraphs = cache(
  async (
    network: HgtpNetwork,
    nodeIds: string[]
  ): Promise<IAPIMetagraphStakingNode[]> => {
    if ([HgtpNetwork.MAINNET_1].includes(network)) {
      return [];
    }

    const parallelExecution = new ParallelExecution<
      IAPIMetagraphStakingNode[]
    >();

    await processBatchedArray(nodeIds, 25, async (nodeIds) => {
      parallelExecution.executeJob(nodeIds.join(","), async () => {
        const response = await DagExplorerAPI.get<
          IAPIResponse<IAPIMetagraphStakingNode[]>
        >(`/${network}/delegators/metagraphs`, {
          params: {
            delegators: nodeIds.map((id) => id.slice(0, 10)).join(","),
          },
        });

        return response.data.data;
      });

      return true;
    });

    const jobs = await parallelExecution.resolveJobs();

    return jobs.map((j) => j.result).flat();
  }
);

const CachedStakingDelegators: Record<HgtpNetwork, AxiosInstance> = {
  [HgtpNetwork.MAINNET]: addCacheBehavior(L0NodesAPI[HgtpNetwork.MAINNET]),
  [HgtpNetwork.INTEGRATIONNET]: addCacheBehavior(
    L0NodesAPI[HgtpNetwork.INTEGRATIONNET]
  ),
  [HgtpNetwork.TESTNET]: addCacheBehavior(L0NodesAPI[HgtpNetwork.TESTNET]),
  [HgtpNetwork.MAINNET_1]: addCacheBehavior(L0NodesAPI[HgtpNetwork.MAINNET_1]),
};

export const getStakingDelegators = cache(
  async (
    network: HgtpNetwork,
    options?: ISearchOptions
  ): Promise<IAPIStakingDelegator[]> => {
    if ([HgtpNetwork.MAINNET_1].includes(network)) {
      return [];
    }

    try {
      const { data: validators } = await CachedStakingDelegators[network].get<
        IL0StakingDelegator[]
      >(`/node-params`, {
        params: { ...options?.search },
      });

      const validatorsMetagraphs = await getDelegatorsMetagraphs(
        network,
        validators.map((v) => v.peerId).sort()
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
        throw new ClusterUpgradeError();
      }

      if (isAxiosError(e) && e.status === 503) {
        return [];
      }

      if (isAxiosError(e) && e.status === 502) {
        return [];
      }

      debugger;

      throw e;
    }
  }
);

export const getAddressStakingDelegations = async (
  network: HgtpNetwork,
  address: string
): Promise<IL0StakingDelegation[]> => {
  if ([HgtpNetwork.MAINNET_1].includes(network)) {
    return [];
  }

  const response = await L0NodesAPI[network].get<IL0StakingAddress>(
    `/delegated-stakes/${address}/info`
  );

  return [
    ...response.data.activeDelegatedStakes,
    ...response.data.pendingWithdrawals,
  ];
};

export const confirmTokenLock = async (
  network: HgtpNetwork,
  hash: string,
  metagraphId?: string,
  options?: IWaitForPredicate
) => {
  return waitForPredicate(async () => {
    const transaction = await getActionTransaction(
      network,
      hash,
      ActionTransactionType.TokenLock,
      metagraphId
    );
    return transaction !== null;
  }, options);
};

export const confirmDelegatedStake = async (
  network: HgtpNetwork,
  hash: string,
  options?: IWaitForPredicate
) => {
  return waitForPredicate(async () => {
    const transaction = await getActionTransaction(
      network,
      hash,
      ActionTransactionType.DelegateStakeCreate
    );
    return transaction !== null;
  }, options);
};

export const confirmWithdrawDelegatedStake = async (
  network: HgtpNetwork,
  hash: string,
  options?: IWaitForPredicate
) => {
  return waitForPredicate(async () => {
    const transaction = await getActionTransaction(
      network,
      hash,
      ActionTransactionType.DelegateStakeWithdraw
    );
    return transaction !== null;
  }, options);
};
