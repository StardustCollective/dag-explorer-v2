"use server";

import { dag4 } from "@stardust-collective/dag4";

import { HgtpNetwork } from "@/common/consts";
import { getAddressActiveTokenLocks } from "@/queries";
import { getActionTransaction } from "@/queries/actions";
import {
  getAddressStakingDelegations,
  getStakingDelegators,
} from "@/queries/staking";
import { ActionTransactionType } from "@/types";
import { getNextTokenCallFullResults } from "@/utils";

export type IAddressDelegation = Awaited<
  ReturnType<typeof getAddressDelegations>
>[number];

export const getAddressDelegations = async (
  network: HgtpNetwork,
  addressId: string
) => {
  const validators = await getStakingDelegators(network);
  const delegations = await getAddressStakingDelegations(network, addressId);

  return (
    await Promise.all(
      delegations.map(async (d) => ({
        ...d,
        validator: validators.find((v) => v.peerId === d.nodeId),
        nodeIdAddress: dag4.keyStore.getDagAddressFromPublicKey(d.nodeId),
        tokenLock: await getActionTransaction(
          network,
          d.tokenLockRef,
          ActionTransactionType.TokenLock
        ),
      }))
    )
  ).sort((a, b) => b.acceptedOrdinal - a.acceptedOrdinal);
};

export const getAddressPendingLocks = async (
  network: HgtpNetwork,
  addressId: string
) => {
  const delegations = await getAddressStakingDelegations(network, addressId);

  const activeTokenLocks = await getNextTokenCallFullResults(
    async ({ limit, nextToken }) => {
      const response = await getAddressActiveTokenLocks(
        network,
        addressId,
        undefined,
        {
          tokenPagination: { limit, next: nextToken },
        }
      );

      return {
        results: response.records,
        nextToken: response.next,
      };
    }
  );

  const pendingLocks = activeTokenLocks.filter(
    (lock) =>
      !delegations.some((delegation) => delegation.tokenLockRef === lock.hash)
  );

  return pendingLocks;
};
