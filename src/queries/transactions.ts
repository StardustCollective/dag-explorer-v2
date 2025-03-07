import { DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { IAPIResponse, IAPIResponseArray, IPaginationOptions } from "@/types";
import { ITransaction } from "@/types";

export const getLatestTransactions = async (
  network: HgtpNetwork,
  options?: IPaginationOptions
): Promise<IAPIResponseArray<ITransaction>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<ITransaction[]>>(
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
): Promise<IAPIResponseArray<ITransaction>> => {
  const response = await DagExplorerAPI.get<IAPIResponse<ITransaction[]>>(
    `/${network}/metagraph/latest-transactions`,
    {
      params: { ...options?.pagination },
    }
  );

  return Object.assign(response.data.data, {
    total: response.data.meta?.total ?? -1,
  });
};
