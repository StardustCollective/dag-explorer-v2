"use client";

import { dag4 } from "@stardust-collective/dag4";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { StakeCard } from "../../components/StakeCard";
import { createDelegatedStake_Stake_Machine } from "../../states";
import { useUserProvider } from "../UserProvider/UserProvider";
import { useValidatorsProvider } from "../ValidatorsProvider/ValidatorsProvider";

import { DelegatedStakeNetworkLockHours } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { withErrorToast } from "@/components/Toast";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { IL0StakingDelegator } from "@/types/staking";
import {
  decodeDecimal,
  formatCurrencyWithDecimals,
  shortenString,
} from "@/utils";

import CircleCheckFilledIcon from "@/assets/icons/circle-check-filled.svg";
import EllipseIcon from "@/assets/icons/ellipse.svg";

export type IStake_ActionsContext = {
  requestAction_stake: (delegator: IL0StakingDelegator) => void;
};

const Stake_ActionsContext = createContext<IStake_ActionsContext | null>(null);

export const Stake_ActionsProvider = ({
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
    userDelegations,
  } = useUserProvider();

  const [actionsMachine, setActionsMachine] = useState(() =>
    createDelegatedStake_Stake_Machine({
      wallet: walletStore,
      actions: walletActions,
      network,
      delegator: null,
      stakingAmount: new Decimal(0),
      tokenLockRef: null,
      delegatedStakeRef: null,
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
      createDelegatedStake_Stake_Machine({
        wallet: walletStore,
        actions: walletActions,
        network,
        delegator: null,
        stakingAmount: new Decimal(0),
        tokenLockRef: null,
        delegatedStakeRef: null,
        toastId: null,
      })
    );
  };

  useEffect(() => {
    if (state === "delegated") {
      validatorsQuery.refetch();
      userBalanceQuery.refetch();
      userDelegationsQuery.refetch();
    }
  }, [state]);

  return (
    <Stake_ActionsContext.Provider
      value={{
        requestAction_stake: withErrorToast(async (delegator) => {
          if (!userDelegationsQuery.isFetched) {
            throw new Error("Missing user delegations data");
          }

          if (userDelegations?.length === 10) {
            throw new Error(
              "You have reached the maximum number of delegations for this address"
            );
          }

          setModalOpen(true);
          set((context) => {
            context.delegator = delegator;
          });
        }),
      }}
    >
      {children}
      {modalOpen && state !== "delegated" && (
        <div className="modal">
          <StakeCard.Initial
            walletBalanceInDAG={userBalanceInDag ?? 0}
            validatorName={shortenString(
              dag4.keyStore.getDagAddressFromPublicKey(
                context.delegator?.peerId ?? ""
              )
            )}
            totalDelegated={formatCurrencyWithDecimals(
              "DAG",
              datumToDag(context.delegator?.totalAmountDelegated ?? 0)
            )}
            estimatedApy="10%"
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
            statuses={{
              step1: {
                initial: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                locking: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Locking <EllipseIcon className="animate-spin shrink-0" />
                  </span>
                ),
                locked: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Locked{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
                delegating: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Locked{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
                delegated: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Locked{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
              }[state],
              step2: {
                initial: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                locking: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                locked: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                delegating: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Delegating <EllipseIcon className="animate-spin shrink-0" />
                  </span>
                ),
                delegated: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Delegated{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
              }[state],
            }}
            disabled={[
              state === "initial" &&
                decodeDecimal(context.stakingAmount).lt(5000),
              state === "initial" &&
                decodeDecimal(context.stakingAmount).gt(userBalanceInDag ?? 0),
              ["locking", "delegating"].includes(state),
            ].some((t) => !!t)}
            actionName={
              {
                initial: "Lock DAG",
                locking: "Locking...",
                locked: "Delegate",
                delegating: "Delegating...",
                delegated: "Delegated",
              }[state]
            }
            value={context.stakingAmount}
            onValueChange={(value) =>
              set((context) => {
                context.stakingAmount = value;
              })
            }
            onCancel={resetState}
            onAction={withErrorToast(async () => {
              if (state === "initial") {
                return await send("lock");
              }

              if (state === "locked") {
                return await send("delegate");
              }
            })}
          />
        </div>
      )}
      {modalOpen && state === "delegated" && (
        <div className="modal">
          <StakeCard.Staked
            validatorName={shortenString(
              dag4.keyStore.getDagAddressFromPublicKey(
                context.delegator?.peerId ?? ""
              )
            )}
            estimatedApy="10%"
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
            value={context.stakingAmount}
            onClose={resetState}
          />
        </div>
      )}
    </Stake_ActionsContext.Provider>
  );
};

export const useStake_ActionsProvider = () => {
  const context = useContext(Stake_ActionsContext);

  if (!context) {
    throw new Error(
      "useStake_ActionsProvider() calls must be done under a <Stake_ActionsProvider/> component"
    );
  }

  return context;
};
