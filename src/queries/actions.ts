import { isAxiosError } from "axios";

import { BlockExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { IAPIResponse, IAPIActionTransaction } from "@/types";
import { ActionTransactionType, IBEActionTransaction } from "@/types/actions";

const TypeParamMap: Record<ActionTransactionType, string> = {
  FeeTransaction: "fee-transactions",
  AllowSpend: "allow-spends",
  SpendTransaction: "spend-transactions",
  ExpiredAllowSpend: "allow-spend-expirations",
  TokenLock: "token-locks",
  TokenUnlock: "token-unlocks",
  DelegateStakeCreate: "delegated-stake-events",
  DelegateStakeWithdraw: "delegated-stake-withdrawals",
};

export const getActionTransaction = async <T extends ActionTransactionType>(
  network: HgtpNetwork,
  actionHash: string,
  type: T,
  metagraphId?: string
): Promise<IAPIActionTransaction<T> | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return null;
  }

  if (
    type === ActionTransactionType.DelegateStakeCreate &&
    !!metagraphId
  ) {
    return null;
  }

  if (
    type === ActionTransactionType.DelegateStakeWithdraw &&
    !!metagraphId
  ) {
    return null;
  }

  if (type === "FeeTransaction" && !metagraphId) {
    return null;
  }

  const typeParam = TypeParamMap[type];

  try {
    const response = await BlockExplorerAPI[network].get<
      IAPIResponse<IBEActionTransaction<T>>
    >(
      metagraphId
        ? `/currency/${metagraphId}/${typeParam}/${actionHash}`
        : `/${typeParam}/${actionHash}`
    );

    return Object.assign(response.data.data, {
      type,
      metagraphId,
    });
  } catch (e) {
    if (isAxiosError(e) && e.status === 404) {
      return null;
    }

    throw e;
  }
};
