"use client";

import { dag4 } from "@stardust-collective/dag4";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { UpdateStakeCard } from "../../components/UpdateStakeCard";
import { createDelegatedStake_UpdateStake_Machine } from "../../states";
import { useUserProvider } from "../UserProvider/UserProvider";
import { useValidatorsProvider } from "../ValidatorsProvider/ValidatorsProvider";

import { DelegatedStakeNetworkLockHours } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { withErrorToast } from "@/components/Toast";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { IAPIStakingDelegator, IL0StakingDelegation } from "@/types/staking";
import {
  decodeDecimal,
  formatCurrencyWithDecimals,
  shortenString,
} from "@/utils";

import CircleCheckFilledIcon from "@/assets/icons/circle-check-filled.svg";
import EllipseIcon from "@/assets/icons/ellipse.svg";

export type IUpdateStake_ActionsContext = {
  requestAction_updateStake: (
    delegation: IL0StakingDelegation,
    delegator: IAPIStakingDelegator
  ) => void;
};

const UpdateStake_ActionsContext =
  createContext<IUpdateStake_ActionsContext | null>(null);

export const UpdateStake_ActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const network = useNetworkContext();
  const walletStore = useWalletStore();
  const walletActions = useWalletActions(walletStore);

  const { validatorsQuery } = useValidatorsProvider();
  const {
    userBalanceQuery,
    userBalanceInDag,
    userDelegationsQuery,
  } = useUserProvider();

  const [actionsMachine, setActionsMachine] = useState(() =>
    createDelegatedStake_UpdateStake_Machine({
      wallet: walletStore,
      actions: walletActions,
      network,
      delegator: null,
      delegation: null,
      newStakingAmount: new Decimal(0),
      newTokenLockRef: null,
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
    validatorsQuery.refetch();
    userBalanceQuery.refetch();
    userDelegationsQuery.refetch();
    setActionsMachine(
      createDelegatedStake_UpdateStake_Machine({
        wallet: walletStore,
        actions: walletActions,
        network,
        delegator: null,
        delegation: null,
        newStakingAmount: new Decimal(0),
        newTokenLockRef: null,
        toastId: null,
      })
    );
  };

  useEffect(() => {
    if (state === "locked") {
      validatorsQuery.refetch();
      userBalanceQuery.refetch();
      userDelegationsQuery.refetch();
    }
  }, [state]);

  return (
    <UpdateStake_ActionsContext.Provider
      value={{
        requestAction_updateStake: withErrorToast(
          async (delegation, delegator) => {
            setModalOpen(true);
            set((context) => {
              context.delegation = delegation;
              context.delegator = delegator;
              context.newStakingAmount = new Decimal(0);
            });
          }
        ),
      }}
    >
      {children}
      {modalOpen && state !== "locked" && (
        <div className="modal">
          <UpdateStakeCard.Initial
            walletBalanceInDAG={userBalanceInDag ?? 0}
            currentStakeAmount={datumToDag(context.delegation?.amount ?? 0)}
            validatorName={shortenString(
              dag4.keyStore.getDagAddressFromPublicKey(
                context.delegator?.peerId ?? ""
              )
            )}
            totalDelegated={formatCurrencyWithDecimals(
              "DAG",
              datumToDag(context.delegator?.totalAmountDelegated ?? 0)
            )}
            validatorCommission={
              decodeDecimal(
                datumToDag(
                  context.delegator?.delegatedStakeRewardParameters
                    .rewardFraction ?? 0
                )
              )
                .mul(100)
                .toNumber() + "%"
            }
            unstakingPeriod={dayjs
              .duration(DelegatedStakeNetworkLockHours[network], "hours")
              .humanize()}
            status={
              {
                initial: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                locking: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Increasing <EllipseIcon className="animate-spin shrink-0" />
                  </span>
                ),
                locked: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Increased{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
              }[state]
            }
            disabled={
              [
                state === "initial" &&
                  decodeDecimal(context.newStakingAmount).lte(0),
                state === "initial" &&
                  decodeDecimal(context.newStakingAmount).gt(
                    decodeDecimal(userBalanceInDag ?? 0)
                  ),
                state === "locking",
              ].some((t) => !!t)
            }
            actionName={
              {
                initial: "Increase Stake",
                locking: "Increasing...",
                locked: "Increased",
              }[state]
            }
            value={context.newStakingAmount}
            onValueChange={(value) =>
              set((context) => {
                context.newStakingAmount = value;
              })
            }
            onCancel={resetState}
            onAction={withErrorToast(async () => {
              if (state === "initial") {
                return await send("lock");
              }
            })}
          />
        </div>
      )}
      {modalOpen && state === "locked" && (
        <div className="modal">
          <UpdateStakeCard.Updated
            validatorName={shortenString(
              dag4.keyStore.getDagAddressFromPublicKey(
                context.delegator?.peerId ?? ""
              )
            )}
            previousAmount={datumToDag(context.delegation?.amount ?? 0)}
            newAmount={decodeDecimal(datumToDag(context.delegation?.amount ?? 0)).add(decodeDecimal(context.newStakingAmount))}
            validatorCommission={
              decodeDecimal(
                datumToDag(
                  context.delegator?.delegatedStakeRewardParameters
                    .rewardFraction ?? 0
                )
              )
                .mul(100)
                .toNumber() + "%"
            }
            onClose={resetState}
          />
        </div>
      )}
    </UpdateStake_ActionsContext.Provider>
  );
};

export const useUpdateStake_ActionsProvider = () => {
  const context = useContext(UpdateStake_ActionsContext);

  if (!context) {
    throw new Error(
      "useUpdateStake_ActionsProvider() calls must be done under a <UpdateStake_ActionsProvider/> component"
    );
  }

  return context;
};
