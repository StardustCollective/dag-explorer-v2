export type ISnapshot = {
  hash: string;
  ordinal: number;
  height: number;
  subHeight: number;
  lastSnapshotHash: string;
  blocks: string[];
  timestamp: string;
  symbol?: string;
  isMetagraphSnapshot?: boolean;
  metagraphId?: string;
  metagraphName?: string;
  fee?: number;
  ownerAddress?: string;
  stakingAddress?: string | null;
  sizeInKB?: number;
};
