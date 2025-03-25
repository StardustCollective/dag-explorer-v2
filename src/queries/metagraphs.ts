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
import { buildAPIResponseArray } from "@/utils";

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

  return buildAPIResponseArray(
    response.data.data,
    response.data.meta?.total ?? -1,
    response.data.meta?.next
  );
};

export const getMetagraph = async (
  network: HgtpNetwork,
  metagraphId: string
): Promise<IMetagraph | null> => {
  try {
    const response = await DagExplorerAPI.get<IAPIResponse<IMetagraph>>(
      `/${network}/metagraphs/${metagraphId}`
    );

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};
