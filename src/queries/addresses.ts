import { isAxiosError } from "axios";

import {
  BlockExplorerAPI,
  BlockExplorerAPI_Exp,
  DagExplorerAPI,
} from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIAddressAction as IAPIAddressAction,
  IAPIAddressMetagraph,
  IAPIResponse,
  IAPIResponseArray,
  IAPITransaction,
  IBEAddressAction,
  IBEAddressBalance,
  IBETransaction,
  INextTokenPaginationOptions,
  IPaginationOptions,
} from "@/types";
import { buildAPIResponseArray } from "@/utils";
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

    console.log({
      balance: response.data.data.balance,
      metagraphId,
      addressId,
    });

    return response.data.data.balance;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return 0;
    }

    throw e;
  }
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

    throw e;
  }
};

export const getAddressTransactions = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseArray<IAPITransaction>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return buildAPIResponseArray([], 0);
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

    return buildAPIResponseArray(
      response.data.data.map((trx) => ({
        ...trx,
        metagraphId,
      })),
      response.data.meta?.total ?? 0,
      response.data.meta?.next
    );
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return buildAPIResponseArray([], 0);
    }

    throw e;
  }
};

export const getAddressRewards = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: IPaginationOptions
): Promise<IAPIAddressReward[]> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return [];
  }

  try {
    const response = await DagExplorerAPI.get<
      IAPIResponse<IAPIAddressReward[]>
    >(
      metagraphId
        ? `/${network}/addresses/${addressId}/metagraphs/${metagraphId}/rewards`
        : `/${network}/addresses/${addressId}/rewards`,
      {
        params: { groupingMode: "day", ...options?.pagination },
      }
    );

    return buildAPIResponseArray(
      response.data.data.map((action) => ({
        ...action,
        metagraphId,
      })),
      response.data.meta?.total ?? 0,
      response.data.meta?.next
    );
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return buildAPIResponseArray([], 0);
    }

    throw e;
  }
};

export const getAddressActions = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIAddressAction[]> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return [];
  }

  try {
    const response = await BlockExplorerAPI_Exp[network].get<
      IAPIResponse<IBEAddressAction[]>
    >(
      metagraphId
        ? `/currency/${metagraphId}/addresses/${addressId}/actions`
        : `/addresses/${addressId}/actions`,
      {
        params: { ...options?.tokenPagination },
      }
    );

    return buildAPIResponseArray(
      response.data.data.map((action) => ({
        ...action,
        metagraphId,
      })),
      response.data.meta?.total ?? 0,
      response.data.meta?.next
    );
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return buildAPIResponseArray([], 0);
    }

    throw e;
  }
};
