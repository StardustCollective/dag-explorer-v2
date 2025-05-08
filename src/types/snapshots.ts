export type IL0Snapshot = {
  //@todo add missing types
  ordinal: number;
  epochProgress: number;
};

export type IBESnapshot = {
  hash: string;
  ordinal: number;
  height: number;
  subHeight: number;
  lastSnapshotHash: string;
  blocks: any[];
  rewards?: {
    destination: string;
    amount: number;
  }[];
  timestamp: string;
  epochProgress?: number;
  fee?: number;
  ownerAddress?: string | null;
  stakingAddress?: string | null;
  sizeInKb?: number;
};

export type IAPISnapshot = IBESnapshot & {
  metagraphId?: string;
};
