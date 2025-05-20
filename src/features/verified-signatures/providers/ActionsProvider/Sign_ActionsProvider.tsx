"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";

import { SignCard } from "../../components/SignCard";
import { createVerifiedSignatures_Sign_Machine } from "../../states";
import { useSignaturesProvider } from "../SignaturesProvider/SignaturesProvider";

import { withErrorToast } from "@/components/Toast";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletActions, useWalletStore } from "@/providers/WalletProvider";
import { shortenString } from "@/utils";

import CircleCheckFilledIcon from "@/assets/icons/circle-check-filled.svg";
import EllipseIcon from "@/assets/icons/ellipse.svg";

export type ISign_ActionsContext = {
  requestAction_sign: () => void;
};

const Sign_ActionsContext = createContext<ISign_ActionsContext | null>(null);

export const Sign_ActionsProvider = ({
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

  const signaturesProvider = useSignaturesProvider();

  const [actionsMachine, setActionsMachine] = useState(() =>
    createVerifiedSignatures_Sign_Machine({
      wallet: walletStore,
      actions: walletActions,
      network,
      message: "",
      signature: null,
      pubKey: null,
      publishHash: null,
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
    setActionsMachine(
      createVerifiedSignatures_Sign_Machine({
        wallet: walletStore,
        actions: walletActions,
        network,
        message: "",
        signature: null,
        pubKey: null,
        publishHash: null,
        toastId: null,
      })
    );
  };

  useEffect(() => {
    if (state === "published") {
      signaturesProvider.resetSignatures();
    }
  }, [state]);

  return (
    <Sign_ActionsContext.Provider
      value={{
        requestAction_sign: withErrorToast(async () => {
          setModalOpen(true);
        }),
      }}
    >
      {children}
      {modalOpen && (
        <div className="modal">
          <SignCard.Sign
            walletAddress={
              walletStatus === "disconnected"
                ? "Connect Wallet"
                : walletStatus === "initializing"
                ? "Initializing..."
                : shortenString(walletAddress ?? "")
            }
            signature={context.signature}
            pubKey={context.pubKey}
            publishHash={context.publishHash}
            statuses={{
              step1: {
                initial: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                signing: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Signing <EllipseIcon className="animate-spin shrink-0" />
                  </span>
                ),
                signed: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Signed{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
                publishing: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Signed{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
                published: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Signed{" "}
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
                signing: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                signed: (
                  <span className="text-hgtp-blue-600/65">
                    Waiting to start
                  </span>
                ),
                publishing: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Publishing <EllipseIcon className="animate-spin shrink-0" />
                  </span>
                ),
                published: (
                  <span className="flex items-center gap-1 text-hgtp-blue-600">
                    Published{" "}
                    <CircleCheckFilledIcon className="text-green-500 shrink-0" />
                  </span>
                ),
              }[state],
            }}
            disabled={[
              ["signing", "publishing", "published"].includes(state),
            ].some((t) => !!t)}
            actionName={
              walletStatus === "connected" && walletAddress
                ? {
                    initial: "Sign message",
                    signing: "Signing...",
                    signed: "Publish",
                    publishing: "Publishing...",
                    published: "Published",
                  }[state]
                : "Connect wallet"
            }
            value={context.message}
            onValueChange={(value) =>
              set((context) => {
                context.message = value;
              })
            }
            onCancel={resetState}
            onAction={withErrorToast(async () => {
              if (walletStatus !== "connected" || !walletAddress) {
                connect();
                return;
              }
              if (state === "initial") {
                return await send("sign");
              }

              if (state === "signed") {
                return await send("publish");
              }
            })}
          />
        </div>
      )}
    </Sign_ActionsContext.Provider>
  );
};

export const useSign_ActionsProvider = () => {
  const context = useContext(Sign_ActionsContext);

  if (!context) {
    throw new Error(
      "useSign_ActionsProvider() calls must be done under a <Sign_ActionsProvider/> component"
    );
  }

  return context;
};
