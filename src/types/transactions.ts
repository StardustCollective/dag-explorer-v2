export type IBETransactionRef_V1 = {
  prevHash: string;
  ordinal: number;
};

export type IBETransaction_V1 = {
  hash: string;
  amount: number;
  receiver: string;
  sender: string;
  fee: number;
  isDummy: boolean;
  lastTransactionRef: IBETransactionRef_V1;
  snapshotHash: string;
  checkpointBlock: string;
  timestamp: string;
};

export type IBETransactionRef = {
  hash: string;
  ordinal: number;
};

export type IBETransaction = {
  hash: string;
  amount: number;
  source: string;
  destination: string;
  fee: number;
  parent: IBETransactionRef;
  blockHash: string;
  snapshotHash: string;
  snapshotOrdinal: number;
  timestamp: string;
};

export type IAPITransaction = IBETransaction & {
  metagraphId?: string;
};
