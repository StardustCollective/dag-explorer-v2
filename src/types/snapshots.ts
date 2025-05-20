import { ISignedL0Value } from "./proofs";

export type IL0Snapshot = {
  ordinal: number;
  height: number;
  subHeight: number;
  lastSnapshotHash: string;
  blocks: [];
  stateChannelSnapshots: Record<
    string,
    ISignedL0Value<{
      lastSnapshotHash: string;
      content: number[];
      fee: number;
    }>[]
  >;
  rewards: [];
  delegateRewards: Record<string, any>;
  epochProgress: number;
  nextFacilitators: string[];
  tips: {
    deprecated: {
      block: {
        height: number;
        hash: string;
      };
      deprecatedAt: number;
    }[];
    remainedActive: {
      block: {
        height: number;
        hash: string;
      };
      usageCount: number;
      introducedAt: number;
    }[];
  };
  stateProof: {
    lastStateChannelSnapshotHashesProof: string;
    lastTxRefsProof: string;
    balancesProof: string;
    lastCurrencySnapshotsProof: {
      leafCount: number;
      hash: string;
    };
    activeAllowSpends: string;
    activeTokenLocks: string;
    tokenLockBalances: string;
    lastAllowSpendRefs: string;
    lastTokenLockRefs: string;
    updateNodeParameters: string;
    activeDelegatedStakes: string;
    delegatedStakesWithdrawals: string;
    activeNodeCollaterals: string;
    nodeCollateralWithdrawals: string;
  };
  allowSpendBlocks: [];
  tokenLockBlocks: [];
  spendActions: Record<string, any>;
  updateNodeParameters: Record<string, any>;
  artifacts: [];
  activeDelegatedStakes: Record<string, any>;
  delegatedStakesWithdrawals: Record<string, any>;
  activeNodeCollaterals: Record<string, any>;
  nodeCollateralWithdrawals: Record<string, any>;
  version: string;
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
  metagraphSnashotCount?: number;
};

export type IAPISnapshot = IBESnapshot & {
  metagraphId?: string;
};
