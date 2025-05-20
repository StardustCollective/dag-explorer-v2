"use client";

import { createContext, useContext } from "react";

import {
  ActionsProvider,
  useActionsProvider,
} from "./providers/ActionsProvider/ActionsProvider";
import {
  SignaturesProvider,
  useSignaturesProvider,
} from "./providers/SignaturesProvider/SignaturesProvider";

const VerifiedSignaturesContextSymbol = Symbol("VerifiedSignaturesContext");

const VerifiedSignaturesContext = createContext<
  typeof VerifiedSignaturesContextSymbol | null
>(null);

export const VerifiedSignaturesProvider = ({
  children,
}: {
  userAddress?: string;
  children: React.ReactNode;
}) => {
  return (
    <VerifiedSignaturesContext.Provider value={VerifiedSignaturesContextSymbol}>
      <SignaturesProvider>
        <ActionsProvider>{children}</ActionsProvider>
      </SignaturesProvider>
    </VerifiedSignaturesContext.Provider>
  );
};

export const useVerifiedSignaturesProvider = () => {
  const context = useContext(VerifiedSignaturesContext);

  if (!context) {
    throw new Error(
      "useVerifiedSignaturesProvider() calls must be done under a <VerifiedSignaturesProvider/> component"
    );
  }

  return Object.assign(useSignaturesProvider(), useActionsProvider());
};
