import { isAxiosError } from "axios";

import { DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseArray,
  IMetagraph,
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

export const getMetagraph = async (
  network: HgtpNetwork,
  currencyId: string
): Promise<IMetagraph | null> => {
  try {
    const response = await DagExplorerAPI.get<IAPIResponse<IMetagraph>>(
      `/${network}/metagraphs/${currencyId}`
    );

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};
