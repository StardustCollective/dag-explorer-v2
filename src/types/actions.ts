export enum ActionTransactionType {
  FeeTransaction = "FeeTransaction",
  AllowSpend = "AllowSpend",
  SpendTransaction = "SpendTransaction",
  ExpiredAllowSpend = "ExpiredAllowSpend",
  TokenLock = "TokenLock",
  TokenUnlock = "TokenUnlock",
  DelegateStakeCreate = "DelegateStakeCreate",
  DelegateStakeWithdraw = "DelegateStakeWithdraw",
}

export const isActionTransactionType = (
  type: any
): type is ActionTransactionType => {
  return Object.values(ActionTransactionType).includes(type);
};

export type IBEActionTransaction_FeeTransaction = {
  // TODO: Complete Type
  type: ActionTransactionType.FeeTransaction;
  hash: string;
  timestamp: string;
};

export type IBEActionTransaction_AllowSpend = {
  type: ActionTransactionType.AllowSpend;
  hash: string;
  ordinal: number;
  amount: number;
  source: string;
  destination: string;
  lastValidEpochProgress: number;
  fee: number;
  snapshotHash: string;
  timestamp: string;
};

export type IBEActionTransaction_SpendTransaction = {
  // TODO: Complete Type
  type: ActionTransactionType.SpendTransaction;
  hash: string;
  timestamp: string;
};

export type IBEActionTransaction_ExpiredSpendTransaction = {
  type: ActionTransactionType.ExpiredAllowSpend;
  hash: string;
  amount: number;
  source: string;
  allowSpendHash: string;
  snapshotHash: string;
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

export type IBEActionTransaction_TokenUnlock = {
  // TODO: Complete Type
  type: ActionTransactionType.TokenUnlock;
  hash: string;
  timestamp: string;
};

export type IBEActionTransaction_DelegatedStake = {
  type: ActionTransactionType.DelegateStakeCreate;
  hash: string;
  ordinal: number;
  source: string;
  nodeId: string;
  amount: number;
  fee: number;
  tokenLockHash: string;
  parentHash: string;
  status: string;
  timestamp: string;
};

export type IBEActionTransaction_DelegatedStakeWithdrawal = {
  type: ActionTransactionType.DelegateStakeWithdraw;
  hash: string;
  source: string;
  stake: {
    hash: string;
    ordinal: number;
    source_addr: string;
    node_id: string;
    amount: number;
    fee: number;
    lock_reference_hash: string;
    parent_hash: string;
    global_snapshot_hash: string;
    transfer_from_hash: string | null;
    created_at: string;
    updated_at: string;
  };
  globalSnapshotHash: string;
  unlockEpoch: number;
  status: string;
  timestamp: string;
};

export type IBEActionTransaction<T extends ActionTransactionType> =
  T extends ActionTransactionType.FeeTransaction
    ? IBEActionTransaction_FeeTransaction
    : T extends ActionTransactionType.AllowSpend
    ? IBEActionTransaction_AllowSpend
    : T extends ActionTransactionType.SpendTransaction
    ? IBEActionTransaction_SpendTransaction
    : T extends ActionTransactionType.ExpiredAllowSpend
    ? IBEActionTransaction_ExpiredSpendTransaction
    : T extends ActionTransactionType.TokenLock
    ? IBEActionTransaction_TokenLock
    : T extends ActionTransactionType.TokenUnlock
    ? IBEActionTransaction_TokenUnlock
    : T extends ActionTransactionType.DelegateStakeCreate
    ? IBEActionTransaction_DelegatedStake
    : T extends ActionTransactionType.DelegateStakeWithdraw
    ? IBEActionTransaction_DelegatedStakeWithdrawal
    : never;

export type IAPIActionTransaction<T extends ActionTransactionType> =
  IBEActionTransaction<T> & {
    metagraphId?: string;
  };

export type IBEGeneralActionTransaction = {
  type: ActionTransactionType;
  currencyId: string | null;
  hash: string;
  amount: number;
  source: string;
  destination: string | null;
  unlockEpoch: number;
  parentHash: string | null;
  timestamp: string;
  globalSnapshotOrdinal: number;
};

export type IAPIGeneralActionTransaction = IBEGeneralActionTransaction & {
  metagraphId?: string;
};
