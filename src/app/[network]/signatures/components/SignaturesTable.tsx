"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { useVerifiedSignaturesProvider } from "@/features/verified-signatures/VerifiedSignaturesProvider";
import { shortenString } from "@/utils";

import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";
import DocumentSignedIcon from "@/assets/icons/document-signed.svg";

export const SignaturesTable = () => {
  const { signatures } = useVerifiedSignaturesProvider();

  return (
    <Table.Suspense
      className="w-full [&_td]:text-sm"
      data={
        signatures?.map((signature) => ({
          ...signature,
          ttl: dayjs(signature.timestamp).add(1, "day").fromNow(),
        })) ?? []
      }
      primaryKey="signature"
      titles={{
        hash: "Id",
        timestamp: "Timestamp",
        ttl: "TTL",
        signature: "Status",
        address: "Signer",
        message: "Message",
      }}
      loadingData={SkeletonSpan.generateTableRecords(5, [
        "hash",
        "timestamp",
        "ttl",
        "address",
        "message",
        "signature",
      ])}
      emptyState={
        <EmptyState
          renderIcon={DocumentSignedIcon}
          label="No recent signatures"
        />
      }
      format={{
        hash: (value) => (
          <span className="flex items-center gap-1">
            <Link className="text-hgtp-blue-600" href={`/signatures/${value}`}>
              {shortenString(value)}
            </Link>
            <CopyAction value={value} />
          </span>
        ),
        timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
        address: (value) => (
          <span className="flex items-center gap-1">
            <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
              {shortenString(value)}
            </Link>
            <CopyAction value={value} />
          </span>
        ),
        signature: (value, record) => (
          <span
            className={clsx(
              "flex items-center gap-1 py-1.5 px-3 w-fit",
              "text-sm font-medium text-green-800",
              "bg-green-50 border border-green-400 rounded-4xl"
            )}
          >
            <CheckCircleOutlineIcon className="size-5 shrink-0" /> Verified
          </span>
        ),
        message: (value) => <span>{shortenString(value)}</span>,
      }}
    />
  );
};
