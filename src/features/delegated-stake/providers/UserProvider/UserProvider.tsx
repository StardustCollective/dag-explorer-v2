"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

import {
  getAddressDelegations,
  getAddressPendingLocks,
  IAddressDelegation,
} from "../../utils/address";

import { datumToDag } from "@/common/currencies";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { getAddressBalance } from "@/queries";
import { IAPIActionTransaction } from "@/types";

export type IUserContext = {
  userBalanceQuery: UseQueryResult<number, Error>;
  userBalanceInDag: IDecimal | null;
  userDelegationsQuery: UseQueryResult<IAddressDelegation[], Error>;
  userDelegations: IAddressDelegation[] | null;
  userDelegationsMap: Record<string, IAddressDelegation> | null;
  userPendingLocksQuery: UseQueryResult<IAPIActionTransaction[], Error>;
  userPendingLocks: IAPIActionTransaction[] | null;
};

const UserContext = createContext<IUserContext | null>(null);

export const UserProvider = ({
  userAddress,
  children,
}: {
  userAddress?: string;
  children: React.ReactNode;
}) => {
  const network = useNetworkContext();

  const userBalanceQuery = useQuery({
    queryKey: ["delegated-staking:user-balance", userAddress],
    queryFn: () => getAddressBalance(network, userAddress ?? ""),
    enabled: !!userAddress,
    refetchInterval: 10 * 1000,
  });

  const userDelegationsQuery = useQuery({
    queryKey: ["delegated-staking:user-staking-delegations", userAddress],
    queryFn: () => getAddressDelegations(network, userAddress ?? ""),
    enabled: !!userAddress,
    refetchInterval: 60 * 1000,
  });

  const userPendingLocksQuery = useQuery({
    queryKey: ["delegated-staking:user-pending-locks", userAddress],
    queryFn: () => getAddressPendingLocks(network, userAddress ?? ""),
    enabled: !!userAddress,
    refetchInterval: 60 * 1000,
  });

  return (
    <UserContext.Provider
      value={{
        userBalanceQuery,
        userBalanceInDag: userBalanceQuery.data
          ? datumToDag(userBalanceQuery.data)
          : null,
        userDelegationsQuery,
        userDelegations: userDelegationsQuery.data ?? null,
        userDelegationsMap:
          userDelegationsQuery.data?.reduce((pv, cv) => {
            pv[cv.nodeId] = cv;
            return pv;
          }, {} as Record<string, IAddressDelegation>) ?? null,
        userPendingLocksQuery,
        userPendingLocks: userPendingLocksQuery.data ?? null,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserProvider = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUserProvider() calls must be done under a <UserProvider/> component"
    );
  }

  return context;
};
