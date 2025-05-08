"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

import { useNetworkContext } from "@/providers/NetworkProvider";
import { getCurrentEpochProgress, getStakingDelegators } from "@/queries";
import { IAPIStakingDelegator } from "@/types/staking";

export type IValidatorsContext = {
  validatorsQuery: UseQueryResult<IAPIStakingDelegator[], Error>;
  validators: IAPIStakingDelegator[] | null;
  epochProgressQuery: UseQueryResult<number | null, Error>;
  epochProgress: number | null;
};

const ValidatorsContext = createContext<IValidatorsContext | null>(null);

export const ValidatorsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const network = useNetworkContext();

  const validatorsQuery = useQuery({
    queryKey: ["delegated-staking:validators"],
    queryFn: () => getStakingDelegators(network),
    refetchInterval: 60 * 1000,
  });

  const epochProgressQuery = useQuery({
    queryKey: ["delegated-staking:epochprogress"],
    queryFn: () => getCurrentEpochProgress(network),
    refetchInterval: 60 * 1000,
  });

  return (
    <ValidatorsContext.Provider
      value={{
        validatorsQuery,
        validators: validatorsQuery.data ?? null,
        epochProgressQuery,
        epochProgress: epochProgressQuery.data ?? null,
      }}
    >
      {children}
    </ValidatorsContext.Provider>
  );
};

export const useValidatorsProvider = () => {
  const context = useContext(ValidatorsContext);

  if (!context) {
    throw new Error(
      "useValidatorsProvider() calls must be done under a <ValidatorsProvider/> component"
    );
  }

  return context;
};
