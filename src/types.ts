export type Snapshot = {
  hash: string;
  ordinal: number;
  height: number;
  subHeight: number;
  lastSnapshotHash: string;
  blocks: string[];
  timestamp: string;
  metagraphId?: string;
};

export type MainnetOneSnapshot = {
  dagAmount: number;
  feeAmount: number;
  height: number;
  txCount: number;
  snapshotHash?: string;
  hash?: string;
};

export type MainnetOneAddressBalance = {
  result: any;
};

export type MainnetOneTransaction = {
  amount: number;
  fee: number;
  hash: string;
  receiver: string;
  sender: string;
  snapshot: string;
  timestamp: string;
  snapshotHash?: string;
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
  symbol?: string;
  isMetagraphTransaction?: boolean
  metagraphId ?: string
  direction?: string
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
  height: number;
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
  Ready = 'Ready',
  Initial = 'Initial',
  ReadyToJoin = 'ReadyToJoin',
  Observing = 'Observing',
  LoadingGenesis = 'LoadingGenesis',
  GenesisReady = 'GenesisReady',
  StartingSession = 'StartingSession',
  SessionStarted = 'SessionStarted',
  WaitingForDownload = 'WaitingForDownload',
  DownloadInProgress = 'DownloadInProgress',
  Leaving = 'Leaving',
  Offline = 'Offline',
}

export type Peer = {
  id: string;
  ip: string;
  publicPort: number;
  p2pPort: number;
  session: string;
  state: NodeState;
};

export type ValidatorNode = {
  ip: string;
  id: string;
  upTime: string;
  status: NodeState;
  latency: number | null;
  address: string;
};

export type TotalSupply = {
  total: number;
  ordinal: number;
};

export type MainnetTotalSupply = {
  height: number;
  value: number;
};

export type Skeleton = {
  headerCols?: string[];
  forSnapshots?: boolean;
  showSkeleton: boolean;
};

export type MainnetOneClusterInfo = {
  id: {
    hex: string;
  };
  ip: {
    host: string;
    port: number; //9001
  };
  status: 'Ready';
  reputation: number;
};

export type MetagraphInfo = {
  metagraphId: string;
  metagraphName: string;
  metagraphSymbol: string;
  metagraphIcon: string;
}

export type MetagraphTransactionResponse = {
  metagraph: MetagraphInfo;
  transaction?: Transaction;
};

export type AddressMetagraphResponse = MetagraphInfo & {
  balance: number
};