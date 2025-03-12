import { BlockExplorerAPI, DagExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { IAPIMetagraphBalance, IAPIResponse, IBEAddressBalance } from "@/types";
import { isAxiosError } from "axios";

export const getAddressBalance = async (
  network: HgtpNetwork,
  addressId: string
): Promise<number> => {
  if (network === HgtpNetwork.MAINNET_1) {
    network = HgtpNetwork.MAINNET;
  }

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBEAddressBalance>
    >(`/addresses/${addressId}/balance`);

    return response.data.data.balance;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return 0;
    }

    throw e;
  }
};

export const getAddressMetagraphBalances = async (
  network: HgtpNetwork,
  addressId: string
): Promise<IAPIMetagraphBalance[]> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return [];
  }

  try {
    const response = await DagExplorerAPI.get<
      IAPIResponse<IAPIMetagraphBalance[]>
    >(`/${network}/addresses/${addressId}/metagraphs`);

    return response.data.data;
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return [];
    }

    throw e;
  }
};
