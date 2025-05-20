import { dag4 } from "@stardust-collective/dag4";
import clsx from "clsx";
import React from "react";

import { CopyAction } from "@/components/CopyAction";
import { PropertiesCard } from "@/components/PropertiesCard";
import { TextAreaInput } from "@/components/TextAreaInput";
import { shortenString } from "@/utils";

import CloseIcon from "@/assets/icons/close.svg";
import SignatureIcon from "@/assets/icons/signature.svg";

export type IVerifiedSignatures_SignCard_SignCardProps = {
  walletAddress: string;
  signature: string | null;
  pubKey: string | null;
  publishHash: string | null;
  statuses?: {
    step1: React.ReactNode;
    step2: React.ReactNode;
  };
  actionName?: React.ReactNode;
  value: string;
  onValueChange: (message: string) => void;
  onCancel?: () => void;
  onAction?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
};

export const VerifiedSignatures_SignCard_SignCard = ({
  walletAddress,
  signature,
  pubKey,
  publishHash,
  statuses,
  actionName,
  value,
  onValueChange,
  onCancel,
  onAction,
  ref,
  disabled,
  className,
}: IVerifiedSignatures_SignCard_SignCardProps) => {
  return (
    <div
      className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)}
      ref={ref}
    >
      <div className="header flex items-center justify-between px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
        <div className="flex items-center gap-2">
          <SignatureIcon className="size-8 shrink-0" />
          Sign Message
        </div>
        <CloseIcon
          className="size-8 shrink-0 text-gray-600"
          onClick={onCancel}
        />
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div>
          <TextAreaInput
            readOnly={!!signature}
            title="Message"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Signer details
          </span>
          <div className="flex flex-col gap-3">
            <PropertiesCard
              variants={["compact"]}
              rows={[
                {
                  label: "Address",
                  value: dag4.keyStore.validateDagAddress(walletAddress) ? (
                    <span className="text-gray-600">
                      {shortenString(walletAddress)}{" "}
                      <CopyAction value={walletAddress} />
                    </span>
                  ) : (
                    <span className="text-gray-600">{walletAddress}</span>
                  ),
                },
                !!signature && {
                  label: "Signature",
                  value: (
                    <span className="text-gray-600">
                      {shortenString(signature)}{" "}
                      <CopyAction value={signature} />
                    </span>
                  ),
                },
                !!pubKey && {
                  label: "Public key",
                  value: (
                    <span className="text-gray-600">
                      {shortenString(pubKey)} <CopyAction value={pubKey} />
                    </span>
                  ),
                },
                !!pubKey && {
                  label: "Message",
                  value: (
                    <span className="text-gray-600">
                      {value === "" ? "(empty)" : shortenString(value)}{" "}
                      <CopyAction value={value} />
                    </span>
                  ),
                },
              ]}
            />
            <PropertiesCard
              variants={["compact"]}
              rows={[
                {
                  label: "Step 1: Sign message",
                  value: statuses?.step1,
                },
                {
                  label: "Step 2: Publish signature (optional)",
                  value: statuses?.step2,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="footer grid grid-cols-2 gap-4 px-6 py-5">
        <button className="button tertiary md" onClick={onCancel}>
          Close
        </button>
        <button
          className="button secondary md"
          disabled={disabled}
          onClick={onAction}
        >
          {actionName}
        </button>
      </div>
    </div>
  );
};
