import { isAxiosError } from "axios";

import {
  BlockExplorerAPI,
  BlockExplorerAPI_Exp,
  DagExplorerAPI,
} from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIMetagraphBalance,
  IAPIResponse,
  IAPIResponseArray,
  IAPITransaction,
  IBEAddressAction,
  IBEAddressBalance,
  IBETransaction,
  INextTokenPaginationOptions,
} from "@/types";
import { buildAPIResponseArray } from "@/utils";

export const getAddressBalance = async (
  network: HgtpNetwork,
  addressId: string
): Promise<number> => {
  if (network === HgtpNetwork.MAINNET_1) {
    network = HgtpNetwork.MAINNET;
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBEAddressBalance>
    >(`/addresses/${addressId}/balance`);

    return response.data.data.balance;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return 0;
    }

    throw e;
  }
};

export const getAddressMetagraphBalances = async (
  network: HgtpNetwork,
  addressId: string
): Promise<IAPIMetagraphBalance[]> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return [];
  }

  try {
    const response = await DagExplorerAPI.get<
      IAPIResponse<IAPIMetagraphBalance[]>
    >(`/${network}/addresses/${addressId}/metagraphs`);

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

export const getAddressActions = async (
  network: HgtpNetwork,
  addressId: string
): Promise<IBEAddressAction[]> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return [];
  }

  try {
    const response = await BlockExplorerAPI_Exp[network].get<
      IAPIResponse<IBEAddressAction[]>
    >(`/addresses/${addressId}/actions`);

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return [];
    }

    throw e;
  }
};
