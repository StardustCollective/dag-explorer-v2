"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import Link from "next/link";
import { useState } from "react";

import { TypeChip } from "./TypeChip";

import { HgtpNetwork, NetworkEpochInSeconds } from "@/common/consts";
import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Pagination } from "@/components/Pagination";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import {
  getAddressActiveTokenLocks,
  getCurrentEpochProgress,
  getMetagraphCurrencySymbol,
} from "@/queries";
import { IAPIActionTransaction } from "@/types";
import { decodeDecimal, shortenString } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import ClockIcon from "@/assets/icons/clock.svg";
import HourglassIcon from "@/assets/icons/hourglass.svg";
import LockedIcon from "@/assets/icons/locked.svg";

export type IActiveLocksTableProps = {
  network: HgtpNetwork;
  addressId: string;
  metagraphId?: string;
  limit?: number;
};

export const ActiveLocksTable = ({
  network,
  addressId,
  metagraphId,
  limit,
}: IActiveLocksTableProps) => {
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const epochProgress = useQuery({
    queryKey: ["epochprogress"],
    queryFn: () => getCurrentEpochProgress(network),
    refetchInterval: 10 * 1000,
  });

  const query = useQuery({
    queryKey: [
      "active-token-locks",
      network,
      addressId,
      metagraphId,
      limit,
      page,
    ],
    queryFn: () =>
      getAddressActiveTokenLocks(network, addressId, metagraphId, {
        tokenPagination: { limit: limit ?? 10, next: nextPageToken },
      }),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  return (
    <Table.Suspense
      noCardStyle
      className="w-full [&_td]:text-sm"
      header={<span></span>}
      data={query.data?.records ?? ([] as IAPIActionTransaction[])}
      primaryKey="hash"
      titles={{
        hash: "Txn Hash",
        type: "Type",
        amount: "Amount Locked",
        timestamp: "Lock Date",
        unlockEpoch: "Unlock Epoch",
      }}
      loading={query.isLoading}
      loadingData={SkeletonSpan.generateTableRecords(3, [
        "hash",
        "type",
        "amount",
        "timestamp",
        "unlockEpoch",
      ])}
      pagination={
        <Pagination
          pageSize={limit ?? 10}
          hasPrevPage={page > 0}
          hasNextPage={!!query.data?.next}
          onNextPage={() => {
            setPage(page + 1);
            setNextPageToken(query.data?.next);
          }}
          onPrevPage={() => setPage(page - 1)}
        />
      }
      emptyState={
        <EmptyState renderIcon={LockedIcon} label="No locks detected" />
      }
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
        type: (value) => (
          <span className="flex items-center w-full lg:justify-start justify-end">
            {value === "FeeTransaction" ? (
              <TypeChip className="text-purple-700 border-purple-400">
                {value}
              </TypeChip>
            ) : value === "TokenLock" ? (
              <TypeChip className="text-ltx-gold-700 border-yellow-400">
                {value}
              </TypeChip>
            ) : value === "TokenUnlock" ? (
              <TypeChip className="text-green-700 border-green-400">
                {value}
              </TypeChip>
            ) : value === "AllowSpend" ? (
              <TypeChip className="text-black/65 border-gray-400">
                {value}
              </TypeChip>
            ) : value === "SpendTransaction" ? (
              <TypeChip className="text-hgtp-blue-600 border-hgtp-blue-400">
                {value}
              </TypeChip>
            ) : (
              <TypeChip className="text-hgtp-blue-700 border-hgtp-blue-400">
                {value}
              </TypeChip>
            )}
          </span>
        ),
        amount: (value, record) => (
          <FormatCurrency
            value={decodeDecimal(value).div(Decimal.pow(10, 8))}
            currency={getMetagraphCurrencySymbol(network, record.metagraphId)}
          />
        ),
        timestamp: (value) => (
          <span className="flex flex-col gap-1">
            <span className="flex items-center gap-1">
              <CalendarClock4Icon className="size-4 shrink-0 text-black/60" />
              {dayjs.utc(value).format("MMM.DD YYYY")}
            </span>
            <span className="flex items-center gap-1 text-black/60">
              <ClockIcon className="size-4 shrink-0 text-black/60" />
              {dayjs.utc(value).format("h:mm:ss a")} +UTC
            </span>
          </span>
        ),
        unlockEpoch: (value) =>
          value && typeof epochProgress.data === "number" ? (
            <span className="flex flex-col gap-1">
              <span className="flex items-center gap-1">
                <HourglassIcon className="size-4 shrink-0 text-black/60" />
                {value}
              </span>
              <span className="flex items-center gap-1 text-black/60">
                <CalendarClock4Icon className="size-4 shrink-0 text-black/60" />
                ~
                {dayjs()
                  .add(
                    (value - epochProgress.data) / NetworkEpochInSeconds,
                    "seconds"
                  )
                  .format("MMM.DD YYYY")}{" "}
                +UTC
              </span>
            </span>
          ) : (
            "--"
          ),
      }}
    />
  );
};
