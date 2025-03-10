import { BlockExplorerAPI, DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseArray,
  IBETransaction,
  IBETransaction_V1,
  IPaginationOptions,
} from "@/types";
import { IAPITransaction } from "@/types";
import { isAxiosError } from "axios";

export const getLatestTransactions = async (
  network: HgtpNetwork,
  options?: IPaginationOptions
): Promise<IAPIResponseArray<IAPITransaction>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<IAPITransaction[]>>(
    `/${network}/dag/latest-transactions`,
    {
      params: { ...options?.pagination },
    }
  );

  return Object.assign(response.data.data, {
    total: response.data.meta?.total ?? -1,
  });
};

export const getLatestMetagraphTransactions = async (
  network: HgtpNetwork,
  options?: IPaginationOptions
): Promise<IAPIResponseArray<IAPITransaction>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<IAPITransaction[]>>(
    `/${network}/metagraph/latest-transactions`,
    {
      params: { ...options?.pagination },
    }
  );

  return Object.assign(response.data.data, {
    total: response.data.meta?.total ?? -1,
  });
};

export const getTransaction = async (
  network: HgtpNetwork,
  transactionHash: string
): Promise<IBETransaction | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return null;
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

export const getTransaction_V1 = async (
  network: HgtpNetwork,
  transactionHash: string
): Promise<IBETransaction_V1 | null> => {
  if (network !== HgtpNetwork.MAINNET_1) {
    return null;
  }

  try {
    const response = await BlockExplorerAPI[network].get<IBETransaction_V1>(
      `/transactions/${transactionHash}`
    );

    return response.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};
