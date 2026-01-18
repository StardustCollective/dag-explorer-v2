import { dag4 } from "@stardust-collective/dag4";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts";
import { dagToDatum, datumToDag } from "@/common/currencies";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { doCloseToast, doToast } from "@/components/Toast";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { confirmTokenLock } from "@/queries";
import { IAPIStakingDelegator, IL0StakingDelegation } from "@/types/staking";
import { decodeDecimal, shortenString, UserError } from "@/utils";
import { createStateMachineStore, IStateMachine } from "@/utils/state_machines";

export type IDelegatedStake_UpdateStake_MachineContext = {
  wallet: ReturnType<typeof useWalletStore>;
  actions: ReturnType<typeof useWalletActions>;
  network: HgtpNetwork;
  delegator: IAPIStakingDelegator | null;
  delegation: IL0StakingDelegation | null;
  newStakingAmount: IDecimal;
  newTokenLockRef: string | null;
  toastId: string | number | null;
};

export type IDelegatedStake_UpdateStake_Machine = IStateMachine<
  IDelegatedStake_UpdateStake_MachineContext,
  "initial" | "locking" | "locked",
  "error" | "reset" | "lock" | "confirmedTokenLock"
>;

export const createDelegatedStake_UpdateStake_Machine = (
  context: IDelegatedStake_UpdateStake_MachineContext
) => {
  return createStateMachineStore<IDelegatedStake_UpdateStake_Machine>(
    {
      initial: {
        events: {
          lock: {
            target: "locking",
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

              if (!context.delegation?.tokenLockRef) {
                throw new UserError("Invalid delegation: missing token lock reference");
              }

              if (decodeDecimal(context.newStakingAmount).lte(0)) {
                throw new UserError("Increase amount must be greater than zero");
              }
            },
          },
        },
        onEntry: async ({ set }) => {
          set((context) => {
            context.newTokenLockRef = null;
            context.toastId = null;
          });
        },
      },
      locking: {
        onEntry: async ({ context, set, send }) => {
          const { requestTokenLock } = context.actions;

          const currentStakeAmount = datumToDag(context.delegation!.amount);
          const totalStakeAmount = decodeDecimal(currentStakeAmount).add(decodeDecimal(context.newStakingAmount));

          const { hash } = await requestTokenLock(
            decodeDecimal(dagToDatum(totalStakeAmount)).toNumber(),
            null,
            null,
            context.delegation!.tokenLockRef
          );

          const toastId = doToast("Waiting for confirmation", "info", {
            duration: Infinity,
          });

          set((context) => {
            context.newTokenLockRef = hash;
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
        onEntry: async ({ context }) => {
          const nodeAddress = dag4.keyStore.getDagAddressFromPublicKey(
            context.delegator!.peerId
          );

          const currentStakeAmount = datumToDag(context.delegation!.amount);
          const totalStakeAmount = decodeDecimal(currentStakeAmount).add(decodeDecimal(context.newStakingAmount));

          doToast(
            <>
              Your stake has been increased to{" "}
              <b>
                <FormatCurrency currency="DAG" value={totalStakeAmount} />
              </b>{" "}
              for validator{" "}
              <span className="inline-flex items-center gap-1 text-hgtp-blue-600">
                <Link href={`/address/${nodeAddress}`}>
                  {shortenString(nodeAddress)}
                </Link>{" "}
                <CopyAction value={nodeAddress} className="size-4" />
              </span>
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
