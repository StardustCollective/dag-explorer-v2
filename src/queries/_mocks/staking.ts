import { getFakerWithSeed } from "./faker";

import { HgtpNetwork } from "@/common/consts";
import { ISearchOptions } from "@/types";
import { IStakingAddress, IStakingDelegator } from "@/types/staking";
import { getPrivateKeyFromId } from "@/utils";

export const mock_getStakingDelegators = async (
  network: HgtpNetwork,
  options?: ISearchOptions
): Promise<IStakingDelegator[]> => {
  const faker = getFakerWithSeed(`staking-delegators`);

  return Array.from({ length: 100 }, (_, index) => ({
    node: getPrivateKeyFromId(`node-${index}`),
    totalStaked: faker.number.int({ max: 1e6 }) * 1e8,
    delegatedStakeRewardParameters: { rewardFraction: (index % 4) * 1000 },
    nodeMetadataParameters: {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
    },
  }));
};

export const mock_getAddressStakingDelegations = async (
  network: HgtpNetwork,
  address: string
): Promise<IStakingAddress> => {
  const faker = getFakerWithSeed(`address-delegations-${address}`);

  return {
    address,
    activeDelegatedStakes: Array.from({ length: 10 }, (_, index) => ({
      node: getPrivateKeyFromId(
        `node-${faker.number.int({ min: 0, max: 100 })}`
      ),
      acceptedOrdinal: faker.number.int({
        max: 2_000,
      }),
      tokenLockRef: faker.string.hexadecimal({
        length: 64,
        prefix: "",
      }),
      amount: faker.number.int({ max: 50_000 }) * 1e8,
      fee: 0,
      withdrawalStarted: null,
      withdrawalFinishes: null,
    })),
    pendingWithdrawals: [],
  };
};
