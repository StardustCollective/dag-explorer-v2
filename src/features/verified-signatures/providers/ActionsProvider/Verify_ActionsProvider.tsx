"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import { VerifyCard } from "../../components/VerifyCard";
import { createVerifiedSignatures_Verify_Machine } from "../../states";

import { withErrorToast } from "@/components/Toast";

export type IVerify_ActionsContext = {
  requestAction_verify: () => void;
};

const Verify_ActionsContext = createContext<IVerify_ActionsContext | null>(
  null
);

export const Verify_ActionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [actionsMachine, setActionsMachine] = useState(() =>
    createVerifiedSignatures_Verify_Machine({
      message: "",
      pubKey: "",
      signature: "",
      assesmentAt: null,
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
      createVerifiedSignatures_Verify_Machine({
        message: "",
        pubKey: "",
        signature: "",
        assesmentAt: null,
        toastId: null,
      })
    );
  };

  return (
    <Verify_ActionsContext.Provider
      value={{
        requestAction_verify: withErrorToast(async () => {
          setModalOpen(true);
        }),
      }}
    >
      {children}
      {modalOpen && (
        <div className="modal">
          <VerifyCard.VerifyCard
            assesmentAt={context.assesmentAt}
            signature={context.signature}
            pubKey={context.pubKey}
            message={context.message}
            onSignatureChange={(signature) =>
              set((context) => {
                context.signature = signature;
              })
            }
            onPubKeyChange={(pubKey) =>
              set((context) => {
                context.pubKey = pubKey;
              })
            }
            onMessageChange={(message) =>
              set((context) => {
                context.message = message;
              })
            }
            verified={state === "verified"}
            disabled={[
              state === "initial" && (!context.signature || !context.pubKey),
              ["verifying", "verified", "not-verified"].includes(state),
            ].some((t) => !!t)}
            actionName={
              {
                initial: "Verify",
                verifying: "Verifying...",
                verified: "Verified",
                "not-verified": "Not verified",
              }[state]
            }
            onCancel={resetState}
            onAction={withErrorToast(async () => {
              if (state === "initial") {
                return await send("verify");
              }
            })}
          />
        </div>
      )}
    </Verify_ActionsContext.Provider>
  );
};

export const useVerify_ActionsProvider = () => {
  const context = useContext(Verify_ActionsContext);

  if (!context) {
    throw new Error(
      "useVerify_ActionsProvider() calls must be done under a <Verify_ActionsProvider/> component"
    );
  }

  return context;
};
