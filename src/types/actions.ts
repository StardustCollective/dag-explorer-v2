export enum ActionTransactionType {
  FeeTransaction = "FeeTransaction",
  AllowSpend = "AllowSpend",
  SpendTransaction = "SpendTransaction",
  SpendExpiration = "SpendExpiration",
  TokenLock = "TokenLock",
  TokenUnlock = "TokenUnlock",
}

export const isActionTransactionType = (
  type: any
): type is ActionTransactionType => {
  return Object.values(ActionTransactionType).includes(type);
};

export type IBEActionTransaction = {
  type: ActionTransactionType;
  hash: string;
  amount: number;
  source: string;
  timestamp: string;
  destination?: string | null;
  ordinal?: number;
  currencyId?: string | null;
  parentHash?: string | null;
  unlockEpoch?: number | null;
  unlockedAtOrdinal?: number | null;
};

export type IAPIActionTransaction = IBEActionTransaction & {
  metagraphId?: string;
};
