export type IBEAddressBalance = {
  ordinal: number;
  balance: number;
  address: string;
};

export type IAPIMetagraphBalance = {
  metagraphId: string;
  metagraphName: string;
  metagraphSymbol: string;
  metagraphIcon: string;
  balance: number;
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

export type IAPIAction = IBEAddressAction & {
  metagraphId?: string;
};
