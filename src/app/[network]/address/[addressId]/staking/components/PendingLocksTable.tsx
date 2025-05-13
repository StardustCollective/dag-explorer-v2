"use client";

import clsx from "clsx";
import Link from "next/link";

import { datumToDag } from "@/common/currencies";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { useDelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";
import { shortenString } from "@/utils";

import LockedIcon from "@/assets/icons/locked.svg";

export const PendingLocksTable = () => {
  const { userPendingLocks, requestAction_assignValidator } =
    useDelegatedStakeProvider();

  if (!userPendingLocks || userPendingLocks.length === 0) {
    return null;
  }

  return (
    <Section
      title="Pending Delegations"
      subtitle={
        <>
          These delegations are missing a node validator, please fix them by
          selecting a valid node validator to start earning rewards
        </>
      }
      className="flex flex-nowrap gap-6"
    >
      <Table.Suspense
        className="w-full [&_td]:text-sm"
        data={userPendingLocks ?? []}
        primaryKey="hash"
        titles={{
          hash: "Token Lock",
          amount: "Amount Locked",
          timestamp: "Status",
          source: "Action",
        }}
        colWidths={{ source: 0.5 }}
        loadingData={SkeletonSpan.generateTableRecords(3, [
          "hash",
          "amount",
          "timestamp",
          "source",
        ])}
        format={{
          hash: (value, record) => (
            <span className="flex items-center gap-1">
              <Link
                className="text-hgtp-blue-600"
                href={
                  record.metagraphId
                    ? `/metagraphs/${record.metagraphId}/transactions/${value}/${record.type}`
                    : `/transactions/${value}/${record.type}`
                }
              >
                {shortenString(value)}
              </Link>
              <CopyAction value={value} />
            </span>
          ),
          amount: (value, record) => (
            <FormatCurrency
              value={datumToDag(value)}
              currency="DAG"
              decimals={{ max: 2 }}
            />
          ),
          timestamp: () => (
            <span
              className={clsx(
                "flex gap-1 items-center justify-center",
                "text-black font-medium text-xs",
                "bg-gray-200",
                "rounded-3xl",
                "h-6 px-3"
              )}
            >
              <LockedIcon className="size-3.5 shrink-0" /> Locked
            </span>
          ),
          source: (_, record) => (
            <button
              className="button primary outlined py-1.5 px-3.5 leading-tight text-sm font-medium"
              onClick={() => {
                requestAction_assignValidator(record as any);
              }}
            >
              Select validator
            </button>
          ),
        }}
      />
    </Section>
  );
};
