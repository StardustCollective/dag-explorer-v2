import { dag4 } from "@stardust-collective/dag4";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { doCloseToast, doToast } from "@/components/Toast";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { confirmDelegatedStake } from "@/queries";
import { IBEActionTransaction_TokenLock } from "@/types";
import { IAPIStakingDelegator } from "@/types/staking";
import { shortenString, UserError } from "@/utils";
import { createStateMachineStore, IStateMachine } from "@/utils/state_machines";

export type IDelegatedStake_AssignValidator_MachineContext = {
  wallet: ReturnType<typeof useWalletStore>;
  actions: ReturnType<typeof useWalletActions>;
  network: HgtpNetwork;
  nextDelegator: IAPIStakingDelegator | null;
  tokenLock: IBEActionTransaction_TokenLock | null;
  delegatedStakeRef: string | null;
  toastId: string | number | null;
};

export type IDelegatedStake_AssignValidator_Machine = IStateMachine<
  IDelegatedStake_AssignValidator_MachineContext,
  "initial" | "review" | "delegating" | "delegated",
  "error" | "reset" | "select" | "delegate" | "confirmedDelegation"
>;

export const createDelegatedStake_AssignValidator_Machine = (
  context: IDelegatedStake_AssignValidator_MachineContext
) => {
  return createStateMachineStore<IDelegatedStake_AssignValidator_Machine>(
    {
      initial: {
        events: {
          select: {
            target: "review",
            guard: async ({ context }) => {
              const { status, address } = context.wallet.getState();
              const { isWalletOnNetwork } = context.actions;

              if (status !== "connected" || !address) {
                throw new UserError("Wallet is not connected");
              }

              if (!(await isWalletOnNetwork(context.network))) {
                throw new UserError(
                  "Wallet is not on the correct network, please switch to the correct network, and connect again"
                );
              }
            },
          },
        },
        onEntry: async ({ set }) => {
          set((context) => {
            context.delegatedStakeRef = null;
            context.toastId = null;
          });
        },
      },
      review: {
        events: {
          delegate: {
            target: "delegating",
            guard: async ({ context }) => {
              const { status, address } = context.wallet.getState();
              const { isWalletOnNetwork } = context.actions;

              if (
                status !== "connected" ||
                !address ||
                !context.tokenLock ||
                !context.nextDelegator
              ) {
                throw new UserError("Invalid state for delegation");
              }

              if (!(await isWalletOnNetwork(context.network))) {
                throw new UserError("Wallet is not on the correct network");
              }
            },
          },
        },
      },
      delegating: {
        onEntry: async ({ context, set, send }) => {
          const { requestDelegatedStake } = context.actions;

          const { hash } = await requestDelegatedStake(
            context.tokenLock!.amount,
            context.nextDelegator!.peerId,
            context.tokenLock!.hash
          );

          const toastId = doToast("Waiting for confirmation", "info", {
            duration: Infinity,
          });

          set((context) => {
            context.delegatedStakeRef = hash;
            context.toastId = toastId;
          });

          await confirmDelegatedStake(context.network, hash, {
            timeoutMs: 10 * 60 * 1000,
          });

          doCloseToast(toastId);

          set((context) => {
            context.toastId = null;
          });

          await send("confirmedDelegation");
        },
        onEntryError: async ({ context, set, send }) => {
          context.toastId !== null && doCloseToast(context.toastId);

          set((context) => {
            context.delegatedStakeRef = null;
            context.toastId = null;
          });

          await send("error");
        },
        events: {
          error: {
            target: "initial",
          },
          confirmedDelegation: {
            target: "delegated",
          },
        },
      },
      delegated: {
        onEntry: async ({ context }) => {
          const nodeAddress = dag4.keyStore.getDagAddressFromPublicKey(
            context.nextDelegator!.peerId
          );

          doToast(
            <>
              Your delegation of{" "}
              <b>
                <FormatCurrency
                  currency="DAG"
                  value={datumToDag(context.tokenLock!.amount)}
                />
              </b>{" "}
              to{" "}
              <span className="inline-flex items-center gap-1 text-hgtp-blue-600">
                <Link href={`/address/${nodeAddress}`}>
                  {shortenString(nodeAddress)}
                </Link>{" "}
                <CopyAction value={nodeAddress} className="size-4" />
              </span>{" "}
              was successfully transferred
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
