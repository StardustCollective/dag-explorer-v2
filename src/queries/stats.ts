import { isAxiosError } from "axios";

import { DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { IAPIResponse } from "@/types";
import { IAPIStats } from "@/types";

export const getNetworkStats = async (
  network: HgtpNetwork
): Promise<IAPIStats | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    network = HgtpNetwork.MAINNET;
  }

  try {
    const response = await DagExplorerAPI.get<IAPIResponse<IAPIStats>>(
      `/${network}/stats`
    );

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    if (isAxiosError(e) && e.status === 500) {
      console.log('Stats 500 Error')
      return null;
    }

    throw e;
  }
};
