import { isAxiosError } from "axios";

import { BlockExplorerAPI } from "@/common/apis";
import { HgtpNetwork } from "@/common/consts";
import { IAPIResponse, IAPIActionTransaction } from "@/types";
import { ActionTransactionType, IBEActionTransaction } from "@/types/actions";

const TypeParamMap: Record<ActionTransactionType, string> = {
  FeeTransaction: "fee-transactions",
  AllowSpend: "allow-spends",
  SpendTransaction: "spend-transactions",
  SpendExpiration: "allow-spend-expirations",
  TokenLock: "token-locks",
  TokenUnlock: "token-unlocks",
  DelegatedStake: "delegated-stakes",
  DelegatedStakeWithdrawal: "delegated-stake-withdrawals",
};

export const getActionTransaction = async (
  network: HgtpNetwork,
  actionHash: string,
  type: ActionTransactionType,
  metagraphId?: string
): Promise<IAPIActionTransaction | null> => {
  if (network === HgtpNetwork.MAINNET_1) {
    return null;
  }

  if (
    type === ActionTransactionType.DelegatedStake &&
    !!metagraphId
  ) {
    return null;
  }

  if (
    type === ActionTransactionType.DelegatedStakeWithdrawal &&
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
      IAPIResponse<IBEActionTransaction>
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
