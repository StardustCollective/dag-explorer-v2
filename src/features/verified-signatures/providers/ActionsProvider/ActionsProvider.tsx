"use client";

import { createContext, useContext } from "react";

import {
  Sign_ActionsProvider,
  useSign_ActionsProvider,
} from "./Sign_ActionsProvider";
import { useVerify_ActionsProvider, Verify_ActionsProvider } from "./Verify_ActionsProvider";

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
      <Sign_ActionsProvider>
        <Verify_ActionsProvider>{children}</Verify_ActionsProvider>
      </Sign_ActionsProvider>
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
    useSign_ActionsProvider(),
    useVerify_ActionsProvider()
  );
};
