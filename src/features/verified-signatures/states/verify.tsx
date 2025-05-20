import { dag4 } from "@stardust-collective/dag4";
import dayjs from "dayjs";

import { doCloseToast, doToast } from "@/components/Toast";
import { shortenString } from "@/utils";
import { createStateMachineStore, IStateMachine } from "@/utils/state_machines";

export type IVerifiedSignatures_Verify_MachineContext = {
  message: string;
  pubKey: string;
  signature: string;
  assesmentAt: string | null;
  toastId: string | number | null;
};

export type IVerifiedSignatures_Verify_Machine = IStateMachine<
  IVerifiedSignatures_Verify_MachineContext,
  "initial" | "verifying" | "verified" | "not-verified",
  "error" | "reset" | "verify" | "verified" | "not-verified"
>;

export const createVerifiedSignatures_Verify_Machine = (
  context: IVerifiedSignatures_Verify_MachineContext
) => {
  return createStateMachineStore<IVerifiedSignatures_Verify_Machine>(
    {
      initial: {
        events: {
          verify: {
            target: "verifying",
            guard: async ({ context }) => {
              if (!context.pubKey || !context.signature) {
                throw new Error("Invalid state for verification");
              }
            },
          },
        },
        onEntry: async ({ set }) => {
          set((context) => {
            context.toastId = null;
          });
        },
      },
      verifying: {
        onEntry: async ({ context, set, send }) => {
          const toastId = doToast("Verifying signature", "info", {
            duration: Infinity,
          });

          set((context) => {
            context.toastId = toastId;
          });

          const signatureRequest = {
            content: context.message,
            metadata: {},
          };

          const signatureRequestEncoded = Buffer.from(
            JSON.stringify(signatureRequest)
          ).toString("base64");

          const rawMessage = `\u0019Constellation Signed Message:\n${signatureRequestEncoded.length}\n${signatureRequestEncoded}`;

          const result = await dag4.keyStore.verify(
            context.pubKey!,
            rawMessage,
            context.signature!
          );

          doCloseToast(toastId);

          set((context) => {
            context.assesmentAt = dayjs().toISOString();
            context.toastId = null;
          });

          await send(result ? "verified" : "not-verified");
        },
        onEntryError: async ({ context, send }) => {
          context.toastId && doCloseToast(context.toastId);

          await send("error");
        },
        events: {
          error: {
            target: "initial",
          },
          verified: {
            target: "verified",
          },
          "not-verified": {
            target: "not-verified",
          },
        },
      },
      verified: {
        onEntry: async ({ context }) => {
          doToast(
            <>Signature {shortenString(context.signature!)} verified</>,
            "success",
            { duration: Infinity }
          );
        },
        events: {
          reset: {
            target: "initial",
          },
        },
      },
      "not-verified": {
        onEntry: async ({ context }) => {
          doToast(
            <>Unable to verify signature {shortenString(context.signature!)}</>,
            "failure",
            { duration: Infinity }
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
