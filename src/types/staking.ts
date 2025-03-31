export type IL0StakingNode = {
  id: string;
  ip: string;
  publicPort: number;
  p2pPort: number;
  clusterSession: string;
  session: string;
  state: "Ready";
  jar: string;
};

export type IL0StakingDelegator = {
  node: IL0StakingNode;
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
};

export type IL0StakingAddress = {
  address: string;
  activeDelegatedStakes: IL0StakingDelegation[];
  pendingWithdrawals: IL0StakingDelegation[];
};
