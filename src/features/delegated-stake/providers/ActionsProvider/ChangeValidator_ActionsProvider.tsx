"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { ChangeValidatorCard } from "../../components/ChangeValidatorCard";
import {
  createDelegatedStake_ChangeValidator_Machine,
} from "../../states";
import { useUserProvider } from "../UserProvider/UserProvider";
import { useValidatorsProvider } from "../ValidatorsProvider/ValidatorsProvider";

import { withErrorToast } from "@/components/Toast";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { IAPIStakingDelegator, IL0StakingDelegation } from "@/types/staking";


export type IChangeValidator_ActionsContext = {
  requestAction_changeValidator: (
    delegation: IL0StakingDelegation,
    validator: IAPIStakingDelegator
  ) => void;
};

const ChangeValidator_ActionsContext =
  createContext<IChangeValidator_ActionsContext | null>(null);

export const ChangeValidator_ActionsProvider = ({
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
  const { userDelegationsQuery, userDelegations } = useUserProvider();

  const [actionsMachine, setActionsMachine] = useState(() =>
    createDelegatedStake_ChangeValidator_Machine({
      wallet: walletStore,
      actions: walletActions,
      network,
      prevDelegator: null,
      nextDelegator: null,
      delegation: null,
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

    setActionsMachine(
      createDelegatedStake_ChangeValidator_Machine({
        wallet: walletStore,
        actions: walletActions,
        network,
        prevDelegator: null,
        nextDelegator: null,
        delegation: null,
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
    <ChangeValidator_ActionsContext.Provider
      value={{
        requestAction_changeValidator: withErrorToast(async (delegation, validator) => {
          setModalOpen(true);
          set((context) => {
            context.delegation = delegation;
            context.prevDelegator = validator;
          });
        }),
      }}
    >
      {children}
      {modalOpen && (
        <div className="modal">
          {state === "initial" && (
            <ChangeValidatorCard.Initial
              selectedValidator={context.nextDelegator}
              currentValidator={context.prevDelegator!}
              validators={(validators ?? []).filter(
                (v) => !userDelegations?.some((d) => d.nodeId === v.peerId)
              )}
              actionName="Review"
              search={search}
              onSearchChange={setSearch}
              onSelectValidator={(delegator) => {
                set((context) => {
                  context.nextDelegator = delegator;
                });
              }}
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
            <ChangeValidatorCard.Review
              prevDelegator={context.prevDelegator!}
              nextDelegator={context.nextDelegator!}
              delegation={context.delegation!}
              actionName={
                state === "delegating"
                  ? "Transferring..."
                  : walletStatus === "connected" && walletAddress
                  ? "Transfer delegation"
                  : "Connect wallet"
              }
              onCancel={resetState}
              disabled={
                walletStatus === "connected" &&
                !!walletAddress &&
                state !== "review"
              }
              onAction={withErrorToast(async () => {
                if (walletStatus !== "connected" || !walletAddress) {
                  connect();
                  return;
                }

                if (state === "review") {
                  return await send("delegate");
                }
              })}
            />
          )}
        </div>
      )}
    </ChangeValidator_ActionsContext.Provider>
  );
};

export const useChangeValidator_ActionsProvider = () => {
  const context = useContext(ChangeValidator_ActionsContext);

  if (!context) {
    throw new Error(
      "useChangeValidator_ActionsProvider() calls must be done under a <ChangeValidator_ActionsProvider/> component"
    );
  }

  return context;
};
