import { isAxiosError } from "axios";

import { getLatestTransactions_V1, getTransaction_V1, getTransactions_V1, getTransactionsBySnapshot_V1 } from "./mainnet_v1";

import { BlockExplorerAPI, DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseData,
  IBETransaction,
  ILimitOffsetPaginationOptions,
  IAPITransaction,
  INextTokenPaginationOptions,
} from "@/types";

export const getLatestTransactions = async (
  network: HgtpNetwork,
  options?: ILimitOffsetPaginationOptions
): Promise<IAPIResponseData<IAPITransaction>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return getLatestTransactions_V1(network, options);
  }

  const response = await DagExplorerAPI.get<IAPIResponse<IAPITransaction[]>>(
    `/${network}/dag/latest-transactions`,
    {
      params: { ...options?.limitPagination },
    }
  );

  return {
    records: response.data.data,
    total: response.data.meta?.total ?? -1,
    next: response.data.meta?.next,
  };
};

export const getLatestMetagraphTransactions = async (
  network: HgtpNetwork,
  options?: ILimitOffsetPaginationOptions
): Promise<IAPIResponseData<IAPITransaction>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return { records: [], total: 0 };
  }

  const response = await DagExplorerAPI.get<IAPIResponse<IAPITransaction[]>>(
    `/${network}/metagraph/latest-transactions`,
    {
      params: { ...options?.limitPagination },
    }
  );

  return {
    records: response.data.data,
    total: response.data.meta?.total ?? -1,
    next: response.data.meta?.next,
  };
};

export const getTransaction = async (
  network: HgtpNetwork,
  transactionHash: string
): Promise<IBETransaction | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return getTransaction_V1(network, transactionHash);
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBETransaction>
    >(`/transactions/${transactionHash}`);

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};

export const getMetagraphTransaction = async (
  network: HgtpNetwork,
  metagraphId: string,
  transactionHash: string
): Promise<IBETransaction | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return null;
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBETransaction>
    >(`/currency/${metagraphId}/transactions/${transactionHash}`);

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};

export const getTransactions = async (
  network: HgtpNetwork,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IAPITransaction>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return getTransactions_V1(network, metagraphId, options);
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBETransaction[]>
    >(metagraphId ? `/currency/${metagraphId}/transactions` : "/transactions", {
      params: { ...options?.tokenPagination },
    });

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

export const getTransactionsBySnapshot = async (
  network: HgtpNetwork,
  ordinal: number,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IAPITransaction>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return getTransactionsBySnapshot_V1(network, ordinal, metagraphId, options);
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBETransaction[]>
    >(
      metagraphId
        ? `/currency/${metagraphId}/snapshots/${ordinal}/transactions`
        : `/global-snapshots/${ordinal}/transactions`,
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
