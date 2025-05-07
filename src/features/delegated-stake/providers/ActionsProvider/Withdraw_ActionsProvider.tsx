"use client";

import { dag4 } from "@stardust-collective/dag4";
import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { WithdrawCard } from "../../components/WithdrawCard";
import { createDelegatedStake_Withdraw_Machine } from "../../states";
import { useUserProvider } from "../UserProvider/UserProvider";
import { useValidatorsProvider } from "../ValidatorsProvider/ValidatorsProvider";

import {
  DelegatedStakeNetworkLockHours,
  NetworkEpochInSeconds,
} from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { withErrorToast } from "@/components/Toast";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { IL0StakingDelegation } from "@/types/staking";
import {
  formatCurrencyWithDecimals,
  formatNumber,
  shortenString,
} from "@/utils";

export type IWithdraw_ActionsContext = {
  requestAction_withdraw: (delegation: IL0StakingDelegation) => void;
};

const Withdraw_ActionsContext = createContext<IWithdraw_ActionsContext | null>(
  null
);

export const Withdraw_ActionsProvider = ({
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

  const { epochProgress } = useValidatorsProvider();
  const { userDelegationsQuery } = useUserProvider();

  const [actionsMachine, setActionsMachine] = useState(() =>
    createDelegatedStake_Withdraw_Machine({
      wallet: walletStore,
      actions: walletActions,
      network,
      delegation: null,
      withdrawDelegatedStakeRef: null,
      toastId: null,
    })
  );
  const { state, context, send, set } = useStore(
    actionsMachine,
    (state) => state
  );

  const [modalOpen, setModalOpen] = useState(false);

  const resetState = () => {
    setModalOpen(false);
    userDelegationsQuery.refetch();
    setActionsMachine(
      createDelegatedStake_Withdraw_Machine({
        wallet: walletStore,
        actions: walletActions,
        network,
        delegation: null,
        withdrawDelegatedStakeRef: null,
        toastId: null,
      })
    );
  };

  useEffect(() => {
    if (state === "withdrawn") {
      resetState();
    }
  }, [state]);

  return (
    <Withdraw_ActionsContext.Provider
      value={{
        requestAction_withdraw: withErrorToast(async (delegation) => {
          setModalOpen(true);
          set((context) => {
            context.delegation = delegation;
          });
        }),
      }}
    >
      {children}
      {modalOpen && (
        <div className="modal">
          <WithdrawCard.Initial
            network={network}
            validatorName={shortenString(
              dag4.keyStore.getDagAddressFromPublicKey(
                context.delegation?.nodeId ?? ""
              )
            )}
            amountStaked={formatCurrencyWithDecimals(
              "DAG",
              datumToDag(context.delegation?.amount ?? 0)
            )}
            totalRewards={formatCurrencyWithDecimals(
              "DAG",
              datumToDag(context.delegation?.rewardAmount ?? 0)
            )}
            unwindingPeriod={dayjs
              .duration(DelegatedStakeNetworkLockHours[network], "hours")
              .humanize()}
            unlockTime={
              <>
                ~
                {dayjs()
                  .add(DelegatedStakeNetworkLockHours[network], "hours")
                  .format("YYYY-MM-DD hh:mmA")}
              </>
            }
            unlockEpoch={
              <>
                ~
                {epochProgress
                  ? formatNumber(
                      Math.floor(
                        epochProgress +
                          (DelegatedStakeNetworkLockHours[network] * 60 * 60) /
                            NetworkEpochInSeconds
                      )
                    )
                  : "--"}
              </>
            }
            actionName={
              state === "withdrawing"
                ? "Unstaking..."
                : walletStatus === "connected" && !!walletAddress
                ? "Unstake"
                : "Connect wallet"
            }
            disabled={state !== "initial"}
            onCancel={resetState}
            onAction={withErrorToast(async () => {
              if (walletStatus !== "connected" || !walletAddress) {
                connect();
                return;
              }

              await send("withdraw");
            })}
          />
        </div>
      )}
    </Withdraw_ActionsContext.Provider>
  );
};

export const useWithdraw_ActionsProvider = () => {
  const context = useContext(Withdraw_ActionsContext);

  if (!context) {
    throw new Error(
      "useWithdraw_ActionsProvider() calls must be done under a <Withdraw_ActionsProvider/> component"
    );
  }

  return context;
};
