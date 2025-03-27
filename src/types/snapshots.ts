export type IBESnapshot = {
  hash: string;
  ordinal: number;
  height: number;
  subHeight: number;
  lastSnapshotHash: string;
  blocks: any[];
  rewards: {
    destination: string;
    amount: number;
  }[];
  timestamp: string;
  fee?: number;
  ownerAddress?: string | null;
  stakingAddress?: string | null;
  sizeInKB?: number;
};

export type IAPISnapshot = IBESnapshot & {
  metagraphId?: string;
};
