import Link from "next/link";

import { HgtpNetwork } from "@/common/consts";
import { CopyAction } from "@/components/CopyAction";
import { doCloseToast, doToast } from "@/components/Toast";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { publishSignature } from "@/queries/actions/signatures";
import { shortenString, UserError } from "@/utils";
import { createStateMachineStore, IStateMachine } from "@/utils/state_machines";

export type IVerifiedSignatures_Sign_MachineContext = {
  wallet: ReturnType<typeof useWalletStore>;
  actions: ReturnType<typeof useWalletActions>;
  network: HgtpNetwork;
  message: string;
  publishHash: string | null;
  signature: string | null;
  pubKey: string | null;
  toastId: string | number | null;
};

export type IVerifiedSignatures_Stake_Machine = IStateMachine<
  IVerifiedSignatures_Sign_MachineContext,
  "initial" | "signing" | "signed" | "publishing" | "published",
  "error" | "reset" | "sign" | "walletSigned" | "publish" | "publishedOnServer"
>;

export const createVerifiedSignatures_Sign_Machine = (
  context: IVerifiedSignatures_Sign_MachineContext
) => {
  return createStateMachineStore<IVerifiedSignatures_Stake_Machine>(
    {
      initial: {
        events: {
          sign: {
            target: "signing",
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
            context.signature = null;
            context.pubKey = null;
            context.toastId = null;
          });
        },
      },
      signing: {
        onEntry: async ({ context, set, send }) => {
          const { requestSignMessage } = context.actions;

          const toastId = doToast("Waiting for wallet signature", "info", {
            duration: Infinity,
          });

          set((context) => {
            context.toastId = toastId;
          });

          const { signature, pubKey } = await requestSignMessage(
            context.message
          );

          doCloseToast(toastId);

          set((context) => {
            context.signature = signature;
            context.pubKey = pubKey;
            context.toastId = null;
          });

          doToast(
            <>
              Your message was signed successfully ({shortenString(signature)}),
              you can either publish your signature to dagexplorer.io or copy
              the values (signature, public key, and message) to use them on
              other platforms.
            </>,
            "success",
            { duration: 60 * 1000 }
          );

          await send("walletSigned");
        },
        onEntryError: async ({ context, send }) => {
          context.toastId && doCloseToast(context.toastId);

          await send("error");
        },
        events: {
          error: {
            target: "initial",
          },
          walletSigned: {
            target: "signed",
          },
        },
      },
      signed: {
        events: {
          publish: {
            target: "publishing",
            guard: async ({ context }) => {
              const { status, address } = context.wallet.getState();

              if (
                status !== "connected" ||
                !address ||
                !context.signature ||
                !context.pubKey
              ) {
                throw new Error("Invalid state for publishing");
              }
            },
          },
        },
      },
      publishing: {
        onEntry: async ({ context, set, send }) => {
          const toastId = doToast("Publishing signature", "info", {
            duration: Infinity,
          });

          set((context) => {
            context.toastId = toastId;
          });

          const verifiedSignature = await publishSignature(
            context.network,
            context.pubKey!,
            context.signature!,
            context.message
          );

          doCloseToast(toastId);

          set((context) => {
            context.toastId = null;
            context.publishHash = verifiedSignature?.hash;
          });

          await send("publishedOnServer");
        },
        onEntryError: async ({ context, set, send }) => {
          context.toastId !== null && doCloseToast(context.toastId);

          set((context) => {
            context.publishHash = null;
            context.toastId = null;
          });

          await send("error");
        },
        events: {
          error: {
            target: "signed",
          },
          publishedOnServer: {
            target: "published",
          },
        },
      },
      published: {
        onEntry: async ({ context }) => {
          doToast(
            <>
              Your signature{' '}
              <span className="inline-flex items-center gap-1 text-hgtp-blue-600">
                <Link href={`/signatures/${context.publishHash}`}>
                  {shortenString(context.publishHash!)}
                </Link>{" "}
                <CopyAction value={context.publishHash} className="size-4" />
              </span>{" "}
              was successfully published
            </>,
            "success",
            { duration: 30 * 1000 }
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
