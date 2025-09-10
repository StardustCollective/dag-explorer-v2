import { isAxiosError } from "axios";

import { getLatestSnapshots_V1, getSnapshot_V1, getSnapshots_V1 } from "./mainnet_v1";

import { BlockExplorerAPI, DagExplorerAPI, L0NodesAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseData,
  ILimitOffsetPaginationOptions,
  IAPISnapshot,
  IBESnapshot,
  INextTokenPaginationOptions,
  ISignedL0Value,
  IL0Snapshot,
} from "@/types";

export const getLatestSnapshots = async (
  network: HgtpNetwork,
  options?: ILimitOffsetPaginationOptions
): Promise<IAPIResponseData<IAPISnapshot>> => {

  if (network === HgtpNetwork.MAINNET_1) {
    return getLatestSnapshots_V1(network, options);
  }

  const response = await DagExplorerAPI.get<IAPIResponse<IAPISnapshot[]>>(
    `/${network}/dag/latest-snapshots`,
    {
      params: { ...options?.limitPagination },
    }
  );

  return {
    records: response.data.data.map((snp) => ({
      ...snp,
      sizeInKb: snp.sizeInKb ?? (snp as any).sizeInKB,
    })),
    total: response.data.meta?.total ?? -1,
    next: response.data.meta?.next,
  };
};

export const getLatestMetagraphSnapshots = async (
  network: HgtpNetwork,
  options?: ILimitOffsetPaginationOptions
): Promise<IAPIResponseData<IAPISnapshot>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return { records: [], total: 0 };
  }

  const response = await DagExplorerAPI.get<IAPIResponse<IAPISnapshot[]>>(
    `/${network}/metagraph/latest-snapshots`,
    {
      params: { ...options?.limitPagination },
    }
  );

  return {
    records: response.data.data.map((snp) => ({
      ...snp,
      sizeInKb: snp.sizeInKb ?? (snp as any).sizeInKB,
    })),
    total: response.data.meta?.total ?? -1,
    next: response.data.meta?.next,
  };
};

export const getSnapshots = async (
  network: HgtpNetwork,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IAPISnapshot>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return getSnapshots_V1(network, metagraphId, options);
  }

  const response = await BlockExplorerAPI[network].get<
    IAPIResponse<IBESnapshot[]>
  >(metagraphId ? `/currency/${metagraphId}/snapshots` : "/global-snapshots", {
    params: { ...options?.tokenPagination },
  });

  try {
    return {
      records: response.data.data.map((snp) => ({
        ...snp,
        sizeInKb: snp.sizeInKb ?? (snp as any).sizeInKB,
        metagraphId,
      })),
      total: response.data.meta?.total ?? -1,
      next: response.data.meta?.next,
    };
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return { records: [], total: 0 };
    }

    throw e;
  }
};

export const getSnapshot = async (
  network: HgtpNetwork,
  ordinal: number,
  metagraphId?: string
): Promise<IAPISnapshot | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return getSnapshot_V1(network, ordinal, metagraphId);
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBESnapshot>
    >(
      metagraphId
        ? `/currency/${metagraphId}/snapshots/${ordinal}`
        : `/global-snapshots/${ordinal}`
    );

    return Object.assign(response.data.data, {
      metagraphId,
      sizeInKb:
        response.data.data.sizeInKb ?? (response.data.data as any).sizeInKB,
    });
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};

export const getCurrentEpochProgress = async (
  network: HgtpNetwork
): Promise<number | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return null;
  }

  if (network === HgtpNetwork.MAINNET) {
    try {
      const response = await L0NodesAPI[network].get<
        ISignedL0Value<IL0Snapshot>
      >("/global-snapshots/latest");

      return response.data.value.epochProgress ?? null;
    } catch (e) {
      if (isAxiosError(e) && e.status === 404) {
        return null;
      }

      throw e;
    }
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBESnapshot>
    >("/global-snapshots/latest");

    return response.data.data.epochProgress ?? null;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};
