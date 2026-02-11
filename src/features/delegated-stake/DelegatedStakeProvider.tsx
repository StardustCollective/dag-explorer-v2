"use client";

import { createContext, useContext } from "react";

import {
  ActionsProvider,
  useActionsProvider,
} from "./providers/ActionsProvider/ActionsProvider";
import {
  UserProvider,
  useUserProvider,
} from "./providers/UserProvider/UserProvider";
import {
  useValidatorsProvider,
  ValidatorsProvider,
} from "./providers/ValidatorsProvider/ValidatorsProvider";

const DelegatedStakeContextSymbol = Symbol("DelegatedStakeContext");

const DelegatedStakeContext = createContext<
  typeof DelegatedStakeContextSymbol | null
>(null);

export const DelegatedStakeProvider = ({
  userAddress,
  children,
}: {
  userAddress?: string;
  children: React.ReactNode;
}) => {
  return (
    <DelegatedStakeContext.Provider value={DelegatedStakeContextSymbol}>
      <ValidatorsProvider>
        <UserProvider userAddress={userAddress}>
          <ActionsProvider>{children}</ActionsProvider>
        </UserProvider>
      </ValidatorsProvider>
    </DelegatedStakeContext.Provider>
  );
};

export const useDelegatedStakeProvider = () => {
  const context = useContext(DelegatedStakeContext);

  if (!context) {
    throw new Error(
      "useDelegatedStakeProvider() calls must be done under a <DelegatedStakeProvider/> component"
    );
  }

  return {
    ...useValidatorsProvider(),
    ...useUserProvider(),
    ...useActionsProvider(),
  };
};
