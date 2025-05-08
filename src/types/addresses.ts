export type IBEAddressBalance = {
  ordinal: number;
  balance: number;
  address: string;
};

export type IAPIAddressMetagraph = {
  metagraphId: string;
  name: string;
  symbol: string;
  iconUrl?: string | null;
};

export type IAPIAddressReward = {
  address: string;
  amount: number;
  accruedAt: string;
  ordinal: number;
  rewardsCount?: number;
  metagraphId?: string;
};
