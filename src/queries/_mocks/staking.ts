import { getFakerWithSeed } from "./faker";

import { HgtpNetwork } from "@/common/consts";
import { ISearchOptions } from "@/types";
import {
  IL0StakingAddress,
  IL0StakingDelegator,
  IL0StakingNode,
} from "@/types/staking";
import { getPrivateKeyFromId } from "@/utils";

const getStakingNode = (nodeId: number): IL0StakingNode => {
  const faker = getFakerWithSeed(`staking-node-${nodeId}`);

  return {
    id: getPrivateKeyFromId(`node-${nodeId}`),
    ip: faker.internet.ip(),
    publicPort: faker.number.int({ min: 10000, max: 65535 }),
    p2pPort: faker.number.int({ min: 10000, max: 65535 }),
    clusterSession: faker.string.hexadecimal({
      length: 64,
      prefix: "",
    }),
    session: faker.string.hexadecimal({
      length: 64,
      prefix: "",
    }),
    state: "Ready",
    jar: faker.string.hexadecimal({ length: 64, prefix: "" }),
  };
};

export const mock_getStakingDelegators = async (
  network: HgtpNetwork,
  options?: ISearchOptions
): Promise<IL0StakingDelegator[]> => {
  const faker = getFakerWithSeed(`staking-delegators`);

  return Array.from({ length: 100 }, (_, index) => ({
    node: getStakingNode(index),
    delegatedStakeRewardParameters: { rewardFraction: (index % 4) * 1000 },
    nodeMetadataParameters: {
      name: faker.company.name(),
      description: faker.lorem.paragraph(),
    },
    totalAmountDelegated: faker.number.int({ max: 1e6 }) * 1e8,
    totalAddressesAssigned: faker.number.int({ max: 100 }),
  }));
};

export const mock_getAddressStakingDelegations = async (
  network: HgtpNetwork,
  address: string
): Promise<IL0StakingAddress> => {
  const faker = getFakerWithSeed(`address-delegations-${address}`);

  return {
    address,
    activeDelegatedStakes: Array.from({ length: 10 }, (_, index) => ({
      nodeId: getPrivateKeyFromId(
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
      hash: faker.string.hexadecimal({
        length: 64,
        prefix: "",
      }),
      withdrawalStartEpoch: null,
      withdrawalEndEpoch: null,
    })),
    pendingWithdrawals: Array.from({ length: 3 }, (_, index) => ({
      nodeId: getPrivateKeyFromId(
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
      hash: faker.string.hexadecimal({
        length: 64,
        prefix: "",
      }),
      withdrawalStartEpoch: faker.number.int({ max: 50_000 }),
      withdrawalEndEpoch: null,
    })),
  };
};
