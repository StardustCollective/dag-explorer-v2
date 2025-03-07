export type ITransactionReference = {
  hash: string;
  ordinal: number;
};

export type ITransaction = {
  hash: string;
  source: string;
  destination: string;
  amount: number;
  fee: number;
  parent: ITransactionReference;
  snapshotHash: string;
  snapshotOrdinal: number;
  blockHash: string;
  timestamp: string;
  transactionOriginal: null;
  symbol?: string;
  isMetagraphTransaction?: boolean;
  metagraphId?: string;
  direction?: string;
};
