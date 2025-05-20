import { dag4 } from "@stardust-collective/dag4";
import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";

import { CopyAction } from "@/components/CopyAction";
import { PropertiesCard } from "@/components/PropertiesCard";
import { TextAreaInput } from "@/components/TextAreaInput";
import { shortenString } from "@/utils";

import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";
import CircleXIcon from "@/assets/icons/circle-x.svg";
import CloseIcon from "@/assets/icons/close.svg";
import DocumentSecurityIcon from "@/assets/icons/document-security.svg";

export type IVerifiedSignatures_VerifyCard_VerifyCardProps = {
  assesmentAt: string | null;
  signature: string;
  pubKey: string;
  message: string;
  onSignatureChange: (signature: string) => void;
  onPubKeyChange: (pubKey: string) => void;
  onMessageChange: (message: string) => void;
  verified?: boolean;
  actionName?: React.ReactNode;
  onCancel?: () => void;
  onAction?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
};

export const VerifiedSignatures_VerifyCard_VerifyCard = ({
  assesmentAt,
  signature,
  pubKey,
  message,
  onSignatureChange,
  onPubKeyChange,
  onMessageChange,
  verified,
  actionName,
  onCancel,
  onAction,
  ref,
  disabled,
  className,
}: IVerifiedSignatures_VerifyCard_VerifyCardProps) => {
  const walletAddress = pubKey
    ? dag4.keyStore.getDagAddressFromPublicKey(pubKey)
    : "";

  return (
    <div
      className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)}
      ref={ref}
    >
      <div className="header flex items-center justify-between px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
        <div className="flex items-center gap-2">
          <DocumentSecurityIcon className="size-8 shrink-0" />
          Verify Signature
        </div>
        <CloseIcon
          className="size-8 shrink-0 text-gray-600"
          onClick={onCancel}
        />
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div>
          <TextAreaInput
            readOnly={!!assesmentAt}
            title="Message"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
          />
        </div>
        <div>
          <TextAreaInput
            readOnly={!!assesmentAt}
            title="Public Key"
            value={pubKey}
            onChange={(e) => onPubKeyChange(e.target.value)}
          />
        </div>
        <div>
          <TextAreaInput
            readOnly={!!assesmentAt}
            title="Signature"
            value={signature}
            onChange={(e) => onSignatureChange(e.target.value)}
          />
        </div>
        {assesmentAt && (
          <div>
            <PropertiesCard
              variants={["compact"]}
              rows={[
                {
                  label: "Assesment At",
                  value: (
                    <span className="text-gray-600">
                      {dayjs(assesmentAt).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                  ),
                },
                !!walletAddress && {
                  label: "Signer",
                  value: (
                    <span className="text-gray-600">
                      {shortenString(walletAddress)}{" "}
                      <CopyAction value={walletAddress} />
                    </span>
                  ),
                },
                {
                  label: "Status",
                  value: verified ? (
                    <span
                      className={clsx(
                        "flex items-center gap-1 py-1.5 px-3 w-fit",
                        "text-sm font-medium text-green-800",
                        "bg-green-50 border border-green-400 rounded-4xl"
                      )}
                    >
                      <CheckCircleOutlineIcon className="size-5 shrink-0" />{" "}
                      Verified
                    </span>
                  ) : (
                    <span
                      className={clsx(
                        "flex items-center gap-1 py-1.5 px-3 w-fit",
                        "text-sm font-medium text-red-800",
                        "bg-red-50 border border-red-400 rounded-4xl"
                      )}
                    >
                      <CircleXIcon className="size-5 shrink-0" /> Not
                      verified
                    </span>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>
      <div className="footer grid grid-cols-2 gap-4 px-6 py-5">
        <button className="button tertiary md" onClick={onCancel}>
          Cancel
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
