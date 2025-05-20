"use client";

import { useVerifiedSignaturesProvider } from "@/features/verified-signatures/VerifiedSignaturesProvider";

import DocumentSecurityIcon from "@/assets/icons/document-security.svg";
import SignatureIcon from "@/assets/icons/signature.svg";

export const SigningActions = () => {
  const { requestAction_sign, requestAction_verify } = useVerifiedSignaturesProvider();

  return (
    <div className="flex gap-2">
      <button className="button secondary sm" onClick={requestAction_sign}>
        <SignatureIcon className="size-5 shrink-0" />
        Sign Message
      </button>
      <button className="button secondary sm" onClick={requestAction_verify}>
        <DocumentSecurityIcon className="size-5 shrink-0" />
        Verify Signature
      </button>
    </div>
  );
};
