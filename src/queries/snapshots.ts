import { DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseArray,
  IPaginationOptions,
  ISnapshot,
} from "@/types";
import { buildAPIResponseArray } from "@/utils";

export const getLatestSnapshots = async (
  network: HgtpNetwork,
  options?: IPaginationOptions
): Promise<IAPIResponseArray<ISnapshot>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<ISnapshot[]>>(
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
): Promise<IAPIResponseArray<ISnapshot>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<ISnapshot[]>>(
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
