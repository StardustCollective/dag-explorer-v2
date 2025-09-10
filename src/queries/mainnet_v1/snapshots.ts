import { isAxiosError } from "axios";

import { StaticData_LatestSnapshots_V1 } from "./static_data";

import { BlockExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponseData,
  ILimitOffsetPaginationOptions,
  IAPISnapshot,
  INextTokenPaginationOptions,
  IBESnapshot_V1,
} from "@/types";

export const getLatestSnapshots_V1 = async (
  network: HgtpNetwork,
  options?: ILimitOffsetPaginationOptions
): Promise<IAPIResponseData<IAPISnapshot>> => {
  if (network !== HgtpNetwork.MAINNET_1) {
    return {
      records: [],
      total: 0,
    };
  }

  return {
    records: StaticData_LatestSnapshots_V1.slice(
      0,
      options?.limitPagination?.limit ?? 10
    ),
    total: StaticData_LatestSnapshots_V1.length,
  };
};

export const getSnapshots_V1 = async (
  network: HgtpNetwork,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IAPISnapshot>> => {
  if (network !== HgtpNetwork.MAINNET_1) {
    return { records: [], total: 0 };
  }

  if (metagraphId) {
    return { records: [], total: 0 };
  }

  return {
    records: StaticData_LatestSnapshots_V1.slice(0, 10),
    total: StaticData_LatestSnapshots_V1.length,
  };
};

export const getSnapshot_V1 = async (
  network: HgtpNetwork,
  ordinal: number,
  metagraphId?: string
): Promise<IAPISnapshot | null> => {
  if (network !== HgtpNetwork.MAINNET_1) {
    return null;
  }

  if (metagraphId) {
    return null;
  }

  try {
    const response = await BlockExplorerAPI[network].get<IBESnapshot_V1>(
      `/snapshot/${ordinal}`
    );

    return {
      hash: response.data.hash,
      ordinal: response.data.height,
      height: 0,
      subHeight: 0,
      lastSnapshotHash: "0".repeat(64),
      blocks: response.data.checkpointBlocks,
      timestamp: response.data.timestamp,
    };
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};
