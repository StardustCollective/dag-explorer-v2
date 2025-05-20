"use client";

import { createContext, useContext } from "react";

import {
  Sign_ActionsProvider,
  useSign_ActionsProvider,
} from "./Sign_ActionsProvider";
// import {
//   useWithdraw_ActionsProvider,
//   Withdraw_ActionsProvider,
// } from "./Withdraw_ActionsProvider";

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
      <Sign_ActionsProvider>{children}</Sign_ActionsProvider>
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

  return Object.assign(
    {},
    useSign_ActionsProvider()
    // useWithdraw_ActionsProvider()
  );
};
