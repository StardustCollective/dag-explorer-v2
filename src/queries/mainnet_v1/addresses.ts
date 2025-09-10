import { isAxiosError } from "axios";

import { BlockExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import {
  IAPIResponseData,
  IAPITransaction,
  INextTokenPaginationOptions,
  IBETransaction_V1,
} from "@/types";

export const getAddressTransactions_V1 = async (
  network: HgtpNetwork,
  addressId: string,
  metagraphId?: string,
  options?: INextTokenPaginationOptions
): Promise<IAPIResponseData<IAPITransaction>> => {
  if (network !== HgtpNetwork.MAINNET_1) {
    return { records: [], total: 0 };
  }

  if (metagraphId) {
    return { records: [], total: 0 };
  }

  try {
    const response = await BlockExplorerAPI[network].get<IBETransaction_V1[]>(
      `/address/${addressId}/transaction`,
      {}
    );

    return {
      records: response.data.map((trx) => ({
        hash: trx.hash,
        amount: trx.amount,
        source: trx.sender,
        destination: trx.receiver,
        fee: trx.fee,
        parent: {
          hash: trx.lastTransactionRef.prevHash,
          ordinal: trx.lastTransactionRef.ordinal,
        },
        blockHash: trx.checkpointBlock,
        snapshotHash: trx.snapshotHash,
        snapshotOrdinal: -1,
        timestamp: trx.timestamp,
      })),
      total: response.data.length,
    };
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return { records: [], total: 0 };
    }

    throw e;
  }
};
