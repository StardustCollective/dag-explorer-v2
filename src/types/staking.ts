export type IAPIMetagraphStakingNode = {
  nodeId: string;
  metagraphId: string;
  name: string;
  symbol: string;
  iconUrl?: string | null;
};

export type IL0StakingNode = {
  id: string;
  ip: string;
  publicPort: number;
  p2pPort: number;
  clusterSession: string;
  session: string;
  state: string;
  jar: string;
};

export type IL0StakingDelegator = {
  peerId: string;
  node: IL0StakingNode | null;
  delegatedStakeRewardParameters: {
    rewardFraction: number;
  };
  nodeMetadataParameters: {
    name: string;
    description: string;
  };
  totalAmountDelegated: number;
  totalAddressesAssigned: number;
};

export type IL0StakingDelegation = {
  nodeId: string;
  acceptedOrdinal: number;
  tokenLockRef: string;
  amount: number;
  fee: number;
  hash: string;
  withdrawalStartEpoch: number | null;
  withdrawalEndEpoch: number | null;
  rewardAmount: number;
  totalBalance: number;
};

export type IL0StakingAddress = {
  address: string;
  activeDelegatedStakes: IL0StakingDelegation[];
  pendingWithdrawals: IL0StakingDelegation[];
};

export type IAPIStakingDelegator = IL0StakingDelegator & {
  nodeIdAddress: string;
  metagraphNode?: IAPIMetagraphStakingNode;
};
