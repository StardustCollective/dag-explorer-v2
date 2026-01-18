"use client";

import { createContext, useContext } from "react";

import {
  AssignValidator_ActionsProvider,
  useAssignValidator_ActionsProvider,
} from "./AssignValidator_ActionsProvider";
import { ChangeValidator_ActionsProvider, useChangeValidator_ActionsProvider } from "./ChangeValidator_ActionsProvider";
import {
  Stake_ActionsProvider,
  useStake_ActionsProvider,
} from "./Stake_ActionsProvider";
import {
  UpdateStake_ActionsProvider,
  useUpdateStake_ActionsProvider,
} from "./UpdateStake_ActionsProvider";
import {
  useWithdraw_ActionsProvider,
  Withdraw_ActionsProvider,
} from "./Withdraw_ActionsProvider";

const ActionsContextSymbol = Symbol("ActionsContext");

const ActionsProviderContext = createContext<
  typeof ActionsContextSymbol | null
>(null);

export const ActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ActionsProviderContext.Provider value={ActionsContextSymbol}>
      <Stake_ActionsProvider>
        <UpdateStake_ActionsProvider>
          <Withdraw_ActionsProvider>
            <AssignValidator_ActionsProvider>
              <ChangeValidator_ActionsProvider>
                {children}
              </ChangeValidator_ActionsProvider>
            </AssignValidator_ActionsProvider>
          </Withdraw_ActionsProvider>
        </UpdateStake_ActionsProvider>
      </Stake_ActionsProvider>
    </ActionsProviderContext.Provider>
  );
};

export const useActionsProvider = () => {
  const context = useContext(ActionsProviderContext);

  if (!context) {
    throw new Error(
      "useActionsProvider() calls must be done under a <ActionsProvider/> component"
    );
  }

  return {
    ...useStake_ActionsProvider(),
    ...useUpdateStake_ActionsProvider(),
    ...useWithdraw_ActionsProvider(),
    ...useAssignValidator_ActionsProvider(),
    ...useChangeValidator_ActionsProvider()
  };
};
