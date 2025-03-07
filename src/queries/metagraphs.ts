import { DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseArray,
  IMetagraphProject,
  IPaginationOptions,
} from "@/types";

export const getMetagraphs = async (
  network: HgtpNetwork,
  options?: IPaginationOptions
): Promise<IAPIResponseArray<IMetagraphProject>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<IMetagraphProject[]>>(
    `/${network}/metagraph-projects`,
    {
      params: { ...options?.pagination },
    }
  );

  return Object.assign(response.data.data, {
    total: response.data.meta?.total ?? -1,
  });
};
