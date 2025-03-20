export type IStakingDelegator = {
  node: string;
  totalStaked: number; // @todo doesnt exist in the schema
  delegatedStakeRewardParameters: { rewardFraction: number };
  nodeMetadataParameters: { name: string; description: string };
};

export type IStakingDelegation = {
  node: string; // @todo doesnt exist in the schema
  acceptedOrdinal: number;
  tokenLockRef: string;
  amount: number;
  fee: number;
  withdrawalStarted: number | null;
  withdrawalFinishes: number | null;
};

export type IStakingAddress = {
  address: string;
  activeDelegatedStakes: IStakingDelegation[];
  pendingWithdrawals: IStakingDelegation[];
};
