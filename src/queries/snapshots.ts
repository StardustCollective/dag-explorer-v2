import { isAxiosError } from "axios";

import { BlockExplorerAPI, DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseArray,
  IPaginationOptions,
  IAPISnapshot,
  IBESnapshot,
  INextTokenPaginationOptions,
} from "@/types";
import { buildAPIResponseArray } from "@/utils";

export const getLatestSnapshots = async (
  network: HgtpNetwork,
  options?: IPaginationOptions
): Promise<IAPIResponseArray<IAPISnapshot>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<IAPISnapshot[]>>(
    `/${network}/dag/latest-snapshots`,
    {
      params: { ...options?.pagination },
    }
  );

  return buildAPIResponseArray(
    response.data.data,
    response.data.meta?.total ?? -1,
    response.data.meta?.next
  );
};

export const getLatestMetagraphSnapshots = async (
  network: HgtpNetwork,
  options?: IPaginationOptions
): Promise<IAPIResponseArray<IAPISnapshot>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<IAPISnapshot[]>>(
    `/${network}/metagraph/latest-snapshots`,
    {
      params: { ...options?.pagination },
    }
  );

  return buildAPIResponseArray(
    response.data.data,
    response.data.meta?.total ?? -1,
    response.data.meta?.next
  );
};

export const getSnapshots = async (
  network: HgtpNetwork,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseArray<IAPISnapshot>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return buildAPIResponseArray([], 0);
  }

  const response = await BlockExplorerAPI[network].get<
    IAPIResponse<IBESnapshot[]>
  >(metagraphId ? `/currency/${metagraphId}/snapshots` : "/global-snapshots", {
    params: { ...options?.tokenPagination },
  });

  try {
    return buildAPIResponseArray(
      response.data.data.map((snp) => ({
        ...snp,
        metagraphId,
      })),
      response.data.meta?.total ?? -1,
      response.data.meta?.next
    );
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return buildAPIResponseArray([], 0);
    }

    throw e;
  }
};
