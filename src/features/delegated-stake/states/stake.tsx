import { dag4 } from "@stardust-collective/dag4";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts";
import { dagToDatum } from "@/common/currencies";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { doCloseToast, doToast } from "@/components/Toast";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import {
  confirmDelegatedStake,
  confirmTokenLock,
} from "@/queries";
import { IL0StakingDelegator } from "@/types/staking";
import { decodeDecimal, shortenString } from "@/utils";
import { createStateMachineStore, IStateMachine } from "@/utils/state_machines";

export type IDelegatedStake_Stake_MachineContext = {
  wallet: ReturnType<typeof useWalletStore>;
  actions: ReturnType<typeof useWalletActions>;
  network: HgtpNetwork;
  delegator: IL0StakingDelegator | null;
  stakingAmount: IDecimal;
  tokenLockRef: string | null;
  delegatedStakeRef: string | null;
  toastId: string | number | null;
};

export type IDelegatedStake_Stake_Machine = IStateMachine<
  IDelegatedStake_Stake_MachineContext,
  "initial" | "locking" | "locked" | "delegating" | "delegated",
  | "error"
  | "reset"
  | "lock"
  | "confirmedTokenLock"
  | "delegate"
  | "confirmedDelegation"
>;

export const createDelegatedStake_Stake_MachineContext = (
  context: IDelegatedStake_Stake_MachineContext
) => {
  return createStateMachineStore<IDelegatedStake_Stake_Machine>(
    {
      initial: {
        events: {
          lock: {
            target: "locking",
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
            },
          },
        },
        onEntry: async ({ set }) => {
          set((context) => {
            context.tokenLockRef = null;
            context.delegatedStakeRef = null;
            context.toastId = null;
          });
        },
      },
      locking: {
        onEntry: async ({ context, set, send }) => {
          const { requestTokenLock } = context.actions;

          const { hash } = await requestTokenLock(
            decodeDecimal(dagToDatum(context.stakingAmount)).toNumber(),
            null,
            null
          );

          const toastId = doToast("Waiting for confirmation", "info", {
            duration: Infinity,
          });

          set((context) => {
            context.tokenLockRef = hash;
            context.toastId = toastId;
          });

          await confirmTokenLock(context.network, hash, undefined, {
            timeoutMs: 10 * 60 * 1000,
          });

          doCloseToast(toastId);

          set((context) => {
            context.toastId = null;
          });

          await send("confirmedTokenLock");
        },
        onEntryError: async ({ context, send }) => {
          context.toastId && doCloseToast(context.toastId);

          await send("error");
        },
        events: {
          error: {
            target: "initial",
          },
          confirmedTokenLock: {
            target: "locked",
          },
        },
      },
      locked: {
        events: {
          delegate: {
            target: "delegating",
            guard: async ({ context }) => {
              const { status, address } = context.wallet.getState();
              const { isWalletOnNetwork } = context.actions;

              if (
                status !== "connected" ||
                !address ||
                !context.tokenLockRef ||
                !context.delegator
              ) {
                throw new Error("Invalid state for delegation");
              }

              if (!(await isWalletOnNetwork(context.network))) {
                throw new Error("Wallet is not on the correct network");
              }
            },
          },
        },
      },
      delegating: {
        onEntry: async ({ context, set, send }) => {
          const { requestDelegatedStake } = context.actions;

          const { hash } = await requestDelegatedStake(
            decodeDecimal(dagToDatum(context.stakingAmount)).toNumber(),
            context.delegator!.peerId,
            context.tokenLockRef!
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
            target: "locked",
          },
          confirmedDelegation: {
            target: "delegated",
          },
        },
      },
      delegated: {
        onEntry: async ({ context }) => {
          const nodeAddress = dag4.keyStore.getDagAddressFromPublicKey(
            context.delegator!.peerId
          );

          doToast(
            <>
              Your delegation of{" "}
              <b>
                <FormatCurrency currency="DAG" value={context.stakingAmount} />
              </b>{" "}
              to{" "}
              <span className="inline-flex items-center gap-1 text-hgtp-blue-600">
                <Link href={`/address/${nodeAddress}`}>
                  {shortenString(nodeAddress)}
                </Link>{" "}
                <CopyAction value={nodeAddress} className="size-4" />
              </span>{" "}
              was successful
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
