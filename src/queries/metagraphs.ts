import { isAxiosError } from "axios";
import { cache } from "react";

import { DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponse,
  IAPIResponseData,
  IAPIMetagraph,
  IMetagraphProject,
  ILimitOffsetPaginationOptions,
  IAPIMetagraphNodes,
} from "@/types";

export const getMetagraphs = async (
  network: HgtpNetwork,
  options?: ILimitOffsetPaginationOptions
): Promise<IAPIResponseData<IMetagraphProject>> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return {
      records: [],
      total: 0,
    };
  }

  const response = await DagExplorerAPI.get<IAPIResponse<IMetagraphProject[]>>(
    `/${network}/metagraph-projects`,
    {
      params: { ...options?.limitPagination },
    }
  );

  return {
    records: response.data.data,
    total: response.data.meta?.total ?? -1,
    next: response.data.meta?.next,
  };
};

export const getMetagraph = async (
  network: HgtpNetwork,
  metagraphId?: string
): Promise<IAPIMetagraph | null> => {
  if (!metagraphId) {
    return null;
  }

  try {
    const response = await DagExplorerAPI.get<IAPIResponse<IAPIMetagraph>>(
      `/${network}/metagraphs/${metagraphId}`,
      { params: { v: "v2" } }
    );

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};

export const getMetagraphNodes = async (
  network: HgtpNetwork,
  metagraphId: string
): Promise<IAPIMetagraphNodes["nodes"] | null> => {
  try {
    const response = await DagExplorerAPI.get<IAPIResponse<IAPIMetagraphNodes>>(
      `/${network}/metagraphs/${metagraphId}/nodes`
    );

    return response.data.data.nodes;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};

export const getMetagraphCurrencySymbol = cache(
  async (
    network: HgtpNetwork,
    metagraphId?: string,
    isDatum?: boolean
  ): Promise<string> => {
    let symbol = "DAG";

    if (metagraphId) {
      const metagraph = await getMetagraph(network, metagraphId);
      symbol = metagraph?.symbol ?? "--";
    }

    return (isDatum ? "d" : "") + symbol;
  }
);

export const getMetagraphIconUrl = cache(
  async (
    network: HgtpNetwork,
    metagraphId?: string
  ): Promise<string | null> => {
    if (!metagraphId) {
      return null;
    }

    const metagraph = await getMetagraph(network, metagraphId);

    if (!metagraph || !metagraph.iconUrl) {
      return null;
    }

    return metagraph.iconUrl;
  }
);
