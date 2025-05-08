import Link from "next/link";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { doCloseToast, doToast } from "@/components/Toast";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { confirmWithdrawDelegatedStake } from "@/queries";
import { IL0StakingDelegation } from "@/types/staking";
import { shortenString } from "@/utils";
import { createStateMachineStore, IStateMachine } from "@/utils/state_machines";

export type IDelegatedStake_Withdraw_MachineContext = {
  wallet: ReturnType<typeof useWalletStore>;
  actions: ReturnType<typeof useWalletActions>;
  network: HgtpNetwork;
  delegation: IL0StakingDelegation | null;
  withdrawDelegatedStakeRef: string | null;
  toastId: string | number | null;
};

export type IDelegatedStake_Withdraw_Machine = IStateMachine<
  IDelegatedStake_Withdraw_MachineContext,
  "initial" | "withdrawing" | "withdrawn",
  "error" | "reset" | "withdraw" | "confirmedWithdraw"
>;

export const createDelegatedStake_Withdraw_Machine = (
  context: IDelegatedStake_Withdraw_MachineContext
) => {
  return createStateMachineStore<IDelegatedStake_Withdraw_Machine>(
    {
      initial: {
        events: {
          withdraw: {
            target: "withdrawing",
            guard: async ({ context }) => {
              const { status, address } = context.wallet.getState();
              const { isWalletOnNetwork } = context.actions;

              if (status !== "connected" || !address) {
                throw new Error("Wallet is not connected");
              }

              if (!(await isWalletOnNetwork(context.network))) {
                throw new Error(
                  "Wallet is not on the correct network, please switch to the correct network, and connect again"
                );
              }

              if (!context.delegation) {
                throw new Error("Delegation is not set");
              }
            },
          },
        },
        onEntry: async ({ set }) => {
          set((context) => {
            context.delegation = null;
            context.withdrawDelegatedStakeRef = null;
            context.toastId = null;
          });
        },
      },
      withdrawing: {
        onEntry: async ({ context, set, send }) => {
          const { requestWithdrawDelegatedStake } = context.actions;

          const { hash } = await requestWithdrawDelegatedStake(
            context.delegation!.hash
          );

          const toastId = doToast("Waiting for confirmation", "info", {
            duration: Infinity,
          });

          set((context) => {
            context.withdrawDelegatedStakeRef = hash;
            context.toastId = toastId;
          });

          console.log({ hash, delegationHash: context.delegation!.hash });

          await confirmWithdrawDelegatedStake(
            context.network,
            context.delegation!.hash,
            {
              timeoutMs: 10 * 60 * 1000,
            }
          );

          doCloseToast(toastId);

          set((context) => {
            context.toastId = null;
          });

          await send("confirmedWithdraw");
        },
        onEntryError: async ({ context, send }) => {
          context.toastId && doCloseToast(context.toastId);

          await send("error");
        },
        events: {
          error: {
            target: "initial",
          },
          confirmedWithdraw: {
            target: "withdrawn",
          },
        },
      },
      withdrawn: {
        onEntry: async ({ context }) => {
          doToast(
            <>
              Withdrawal of{" "}
              <b>
                <FormatCurrency
                  currency="DAG"
                  value={datumToDag(context.delegation!.amount)}
                />
              </b>{" "}
              from delegation{" "}
              <span className="inline-flex items-center gap-1 text-hgtp-blue-600">
                <Link
                  href={`/transactions/${
                    context.delegation!.hash
                  }/DelegatedStake`}
                >
                  {shortenString(context.delegation!.hash)}
                </Link>{" "}
                <CopyAction
                  value={context.delegation!.hash}
                  className="size-4"
                />
              </span>{" "}
              has started
            </>
          );
        },
        events: {
          reset: {
            target: "initial",
          },
        },
      },
    },
    "initial",
    context
  );
};
