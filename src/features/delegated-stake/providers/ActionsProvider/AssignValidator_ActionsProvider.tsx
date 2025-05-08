"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { AssignValidatorCard } from "../../components/AssignValidatorCard";
import { createDelegatedStake_AssignValidator_Machine } from "../../states";
import { useUserProvider } from "../UserProvider/UserProvider";
import { useValidatorsProvider } from "../ValidatorsProvider/ValidatorsProvider";

import { withErrorToast } from "@/components/Toast";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { IBEActionTransaction_TokenLock } from "@/types";

export type IAssignValidator_ActionsContext = {
  requestAction_assignValidator: (
    tokenLock: IBEActionTransaction_TokenLock
  ) => void;
};

const AssignValidator_ActionsContext =
  createContext<IAssignValidator_ActionsContext | null>(null);

export const AssignValidator_ActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const network = useNetworkContext();
  const walletStore = useWalletStore();
  const walletActions = useWalletActions(walletStore);
  const walletStatus = useStore(walletStore, (state) => state.status);
  const walletAddress = useStore(walletStore, (state) => state.address);
  const connect = useStore(walletStore, (state) => state.connect);

  const { validatorsQuery, validators } = useValidatorsProvider();
  const { userDelegationsQuery, userDelegations, userPendingLocksQuery } =
    useUserProvider();

  const [actionsMachine, setActionsMachine] = useState(() =>
    createDelegatedStake_AssignValidator_Machine({
      wallet: walletStore,
      actions: walletActions,
      network,
      nextDelegator: null,
      tokenLock: null,
      delegatedStakeRef: null,
      toastId: null,
    })
  );
  const { state, context, send, set } = useStore(
    actionsMachine,
    (state) => state
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const resetState = () => {
    setModalOpen(false);
    validatorsQuery.refetch();
    userDelegationsQuery.refetch();
    userPendingLocksQuery.refetch();
    setActionsMachine(
      createDelegatedStake_AssignValidator_Machine({
        wallet: walletStore,
        actions: walletActions,
        network,
        nextDelegator: null,
        tokenLock: null,
        delegatedStakeRef: null,
        toastId: null,
      })
    );
  };

  useEffect(() => {
    if (state === "delegated") {
      resetState();
    }
  }, [state]);

  return (
    <AssignValidator_ActionsContext.Provider
      value={{
        requestAction_assignValidator: withErrorToast(async (tokenLock) => {
          setModalOpen(true);
          set((context) => {
            context.tokenLock = tokenLock;
          });
        }),
      }}
    >
      {children}
      {modalOpen && (
        <div className="modal">
          {state === "initial" && (
            <AssignValidatorCard.Initial
              tokenLock={context.tokenLock!}
              selectedValidator={context.nextDelegator}
              validators={(validators ?? []).filter(
                (v) => !userDelegations?.some((d) => d.nodeId === v.peerId)
              )}
              actionName="Review"
              search={search}
              onSearchChange={setSearch}
              onSelectValidator={(delegator) =>
                set((context) => {
                  context.nextDelegator = delegator;
                })
              }
              onCancel={resetState}
              disabled={state !== "initial" || !context.nextDelegator}
              onAction={withErrorToast(async () => {
                if (walletStatus !== "connected" || !walletAddress) {
                  connect();
                  return;
                }

                if (state === "initial") {
                  return await send("select");
                }
              })}
            />
          )}
          {state !== "initial" && (
            <AssignValidatorCard.Review
              tokenLock={context.tokenLock!}
              delegator={context.nextDelegator!}
              actionName={
                state === "delegating"
                  ? "Assigning..."
                  : walletStatus === "connected" && walletAddress
                  ? "Assign delegation"
                  : "Connect wallet"
              }
              onCancel={resetState}
              disabled={
                walletStatus === "connected" &&
                !!walletAddress &&
                state !== "review"
              }
              onAction={async () => {
                if (walletStatus !== "connected" || !walletAddress) {
                  connect();
                  return;
                }

                send("delegate");
              }}
            />
          )}
        </div>
      )}
    </AssignValidator_ActionsContext.Provider>
  );
};

export const useAssignValidator_ActionsProvider = () => {
  const context = useContext(AssignValidator_ActionsContext);

  if (!context) {
    throw new Error(
      "useAssignValidator_ActionsProvider() calls must be done under a <AssignValidator_ActionsProvider/> component"
    );
  }

  return context;
};
