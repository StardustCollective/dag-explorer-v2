import { isAxiosError } from "axios";

import { getAddressTransactions_V1 } from "./mainnet_v1";

import { BlockExplorerAPI, DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIActionTransaction,
  IAPIAddressMetagraph,
  IAPIResponse,
  IAPIResponseData,
  IAPITransaction,
  IBEActionTransaction,
  IBEAddressBalance,
  IBETransaction,
  INextTokenPaginationOptions,
  ILimitOffsetPaginationOptions,
  IAPIGeneralActionTransaction,
  IBEGeneralActionTransaction,
  ActionTransactionType,
} from "@/types";
import { IAPIAddressReward } from "@/types";

export const getAddressBalance = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string
): Promise<number> => {
  if (network === HgtpNetwork.MAINNET_1) {
    network = HgtpNetwork.MAINNET;
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBEAddressBalance>
    >(
      metagraphId
        ? `/currency/${metagraphId}/addresses/${addressId}/balance`
        : `/addresses/${addressId}/balance`
    );

    return response.data.data.balance;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return 0;
    }

    throw e;
  }
};

export const getAddressLockedBalance = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string
): Promise<number> => {
  if (network === HgtpNetwork.MAINNET_1) {
    network = HgtpNetwork.MAINNET;
  }

  const { records: allowSpends } = await getAddressActions(
    network,
    addressId,
    metagraphId
  );

  const { records: tokenLocks } = await getAddressActiveTokenLocks(
    network,
    addressId,
    metagraphId
  );

  const actions = [...allowSpends, ...tokenLocks];

  return actions.reduce((pv, action) => pv + action.amount, 0);
};

export const getAddressMetagraphs = async (
  network: HgtpNetwork,
  addressId: string
): Promise<IAPIAddressMetagraph[]> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return [];
  }

  try {
    const response = await DagExplorerAPI.get<
      IAPIResponse<IAPIAddressMetagraph[]>
    >(`/${network}/addresses/${addressId}/metagraphs`, { params: { v: "v2" } });

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return [];
    }

    if (isAxiosError(e) && e.message.match(/timeout/i)) {
      console.log(e);
      return [];
    }

    throw e;
  }
};

export const getAddressTransactions = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IAPITransaction>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return getAddressTransactions_V1(network, addressId, metagraphId, options);
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBETransaction[]>
    >(
      metagraphId
        ? `/currency/${metagraphId}/addresses/${addressId}/transactions`
        : `/addresses/${addressId}/transactions`,
      {
        params: { ...options?.tokenPagination },
      }
    );

    return {
      records: response.data.data.map((trx) => ({
        ...trx,
        metagraphId,
      })),
      total: response.data.meta?.total ?? 0,
      next: response.data.meta?.next,
    };
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return { records: [], total: 0 };
    }

    throw e;
  }
};

export const getAddressRewards = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: ILimitOffsetPaginationOptions
): Promise<IAPIResponseData<IAPIAddressReward>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return { records: [], total: 0 };
  }

  try {
    const response = await DagExplorerAPI.get<
      IAPIResponse<IAPIAddressReward[]>
    >(
      metagraphId
        ? `/${network}/addresses/${addressId}/metagraphs/${metagraphId}/rewards`
        : `/${network}/addresses/${addressId}/rewards`,
      {
        params: { groupingMode: "day", ...options?.limitPagination },
      }
    );

    return {
      records: response.data.data.map((action) => ({
        ...action,
        metagraphId,
      })),
      total: response.data.meta?.total ?? 0,
      next: response.data.meta?.next,
    };
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return { records: [], total: 0 };
    }

    throw e;
  }
};

export const getAddressActions = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IAPIGeneralActionTransaction>> => {
  if ([HgtpNetwork.MAINNET_1].includes(network)) {
    return { records: [], total: 0 };
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBEGeneralActionTransaction[]>
    >(
      metagraphId
        ? `/currency/${metagraphId}/addresses/${addressId}/actions`
        : `/addresses/${addressId}/actions`,
      {
        params: { ...options?.tokenPagination },
      }
    );

    return {
      records: response.data.data.map((action) => ({
        ...action,
        metagraphId,
      })),
      total: response.data.meta?.total ?? 0,
      next: response.data.meta?.next,
    };
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return { records: [], total: 0 };
    }

    throw e;
  }
};

export const getAddressActiveTokenLocks = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<
  IAPIResponseData<IAPIActionTransaction<ActionTransactionType.TokenLock>>
> => {
  if ([HgtpNetwork.MAINNET_1].includes(network)) {
    return { records: [], total: 0 };
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBEActionTransaction<ActionTransactionType.TokenLock>[]>
    >(
      metagraphId
        ? `/currency/${metagraphId}/addresses/${addressId}/token-locks`
        : `/addresses/${addressId}/token-locks`,
      {
        params: { ...options?.tokenPagination, active: true },
      }
    );

    return {
      records: response.data.data
        .map((action) => ({
          ...action,
          type: "TokenLock" as any,
          metagraphId,
        }))
        .filter((action) => action.unlockEpoch === null),
      total: response.data.meta?.total ?? 0,
      next: response.data.meta?.next,
    };
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return { records: [], total: 0 };
    }

    throw e;
  }
};
