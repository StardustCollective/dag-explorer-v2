export enum ActionTransactionType {
  FeeTransaction = "FeeTransaction",
  AllowSpend = "AllowSpend",
  SpendTransaction = "SpendTransaction",
  SpendExpiration = "SpendExpiration",
  TokenLock = "TokenLock",
  TokenUnlock = "TokenUnlock",
  DelegatedStake = "DelegatedStake",
  DelegatedStakeWithdrawal = "DelegatedStakeWithdrawal",
}

export const isActionTransactionType = (
  type: any
): type is ActionTransactionType => {
  return Object.values(ActionTransactionType).includes(type);
};

export type IBEActionTransaction_DelegatedStake = {
  type: ActionTransactionType.DelegatedStake;
  hash: string;
  ordinal: number;
  source: string;
  nodeId: string;
  amount: number;
  fee: number;
  tokenLockRef: string;
  parentHash: string;
  globalSnapshotHash: string;
  timestamp: string;
};

export type IBEActionTransaction_DelegatedStakeWithdrawal = {
  type: ActionTransactionType.DelegatedStakeWithdrawal;
  hash: string;
  source: string;
  stakeHash: string;
  globalSnapshotHash: string;
  timestamp: string;
};

export type IBEActionTransaction_TokenLock = {
  type: ActionTransactionType.TokenLock;
  hash: string;
  amount: number;
  source: string;
  unlockEpoch: number | null;
  parentHash: string;
  ordinal: number;
  timestamp: string;
  unlockedAtOrdinal: number | null;
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
