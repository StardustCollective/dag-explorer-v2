export type IBEAddressBalance = {
  ordinal: number;
  balance: number;
  address: string;
};

export type IAPIAddressMetagraph = {
  metagraphId: string;
  name: string;
  symbol: string;
  iconUrl?: string | null;
};

export type IBEAddressAction = {
  type:
    | "FeeTransaction"
    | "AllowSpend"
    | "SpendTransaction"
    | "TokenLock"
    | "TokenUnlock";
  currencyId: string | null;
  hash: string;
  amount: number;
  source: string;
  parentHash?: string;
  unlockEpoch?: number;
  timestamp: string;
};

export type IAPIAddressAction = IBEAddressAction & {
  metagraphId?: string;
};

export type IAPIAddressReward = {
  address: string;
  amount: number;
  accruedAt: string;
  ordinal: number;
  rewardsCount?: number;
  metagraphId?: string;
};
