export type Snapshot = {
  hash: string;
  ordinal: number;
  height: number;
  subHeight: number;
  lastSnapshotHash: string;
  blocks: string[];
  timestamp: string;
};

export type MainnetOneSnapshot = {
  dagAmount: number;
  feeAmount: number;
  hash: string;
  receiver: string;
  sender: string;
  snapshot: string;
  timestamp: string;
};

export type MainnetOneTransaction = {
  amount: number;
  fee: number;
  height: number;
  txCount: number;
};

export type RewardTransaction = {
  destination: string;
  amount: number;
};

export type Transaction = {
  hash: string;
  source: string;
  destination: string;
  amount: number;
  fee: number;
  parent: TransactionReference;
  snapshotHash: string;
  snapshotOrdinal: number;
  blockHash: string;
  timestamp: string;
  transactionOriginal: null;
};

type TransactionReference = {
  hash: string;
  ordinal: number;
};

type BlockReference = {
  hash: string;
  height: number;
};

export type Block = {
  hash: string;
  heigth: number;
  transactions: string[];
  parent: BlockReference;
  snapshotHash: string;
  snapshotOrdinal: number;
  timestamp: string;
};

export type NotFound = {
  message: string;
  errors: string[];
};

export type Balance = {
  balance: number;
  ordinal: number;
};

enum NodeState {
  'Ready',
  'Initial',
  'ReadyToJoin',
  'LoadingGenesis',
  'GenesisReady',
  'StartingSession',
  'SessionStarted',
  'WaitingForDownload',
  'DownloadInProgress',
  'Leaving',
  'Offline',
}

export type Peer = {
  id: string;
  ip: string;
  publicPort: number;
  p2pPort: number;
  session: string;
  state: NodeState;
};

export type TotalSupply = {
  total: number;
  ordinal: number;
};
