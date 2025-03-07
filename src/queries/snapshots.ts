import { DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { IAPIResponse, IAPIResponseArray, IPaginationOptions } from "@/types";
import { ISnapshot } from "@/types";

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

  return Object.assign(response.data.data, {
    total: response.data.meta?.total ?? -1,
  });
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

  return Object.assign(response.data.data, {
    total: response.data.meta?.total ?? -1,
  });
};
