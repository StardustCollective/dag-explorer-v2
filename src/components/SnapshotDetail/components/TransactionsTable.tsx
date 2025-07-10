"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { FormatCurrencyPrice } from "@/components/FormatCurrencyPrice";
import { Pagination } from "@/components/Pagination";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import {
  getMetagraphCurrencySymbol,
  getTransactionsBySnapshot,
} from "@/queries";
import { IAPITransaction } from "@/types";
import { shortenString } from "@/utils";

export type ITransactionsTableProps = {
  network: HgtpNetwork;
  ordinal: number;
  metagraphId?: string;
  limit?: number;
};

export const TransactionsTable = ({
  network,
  ordinal,
  metagraphId,
  limit,
}: ITransactionsTableProps) => {
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const query = useQuery({
    queryKey: [
      "transactions",
      network,
      "snapshot",
      ordinal,
      metagraphId,
      limit,
      page,
    ],
    queryFn: () =>
      getTransactionsBySnapshot(network, ordinal, metagraphId, {
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
      data={query.data?.records ?? ([] as IAPITransaction[])}
      primaryKey="hash"
      titles={{
        hash: "Txn Hash",
        timestamp: "Timestamp",
        snapshotOrdinal: "Snapshot",
        fee: "Fee",
        source: "From",
        destination: "To",
        amount: "Amount",
      }}
      loading={query.isLoading}
      loadingData={SkeletonSpan.generateTableRecords(3, [
        "hash",
        "timestamp",
        "snapshotOrdinal",
        "fee",
        "source",
        "destination",
        "amount",
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
      emptyState={<EmptyState label="No transactions detected" />}
      format={{
        hash: (value, record) => (
          <span className="flex items-center gap-1">
            <Link
              className="text-hgtp-blue-600"
              href={
                record.metagraphId
                  ? `/metagraphs/${record.metagraphId}/transactions/${value}`
                  : `/transactions/${value}`
              }
            >
              {shortenString(value)}
            </Link>
            <CopyAction value={value} />
          </span>
        ),
        timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
        snapshotOrdinal: (value, record) => (
          <Link
            className="text-hgtp-blue-600"
            href={
              record.metagraphId
                ? `/metagraphs/${record.metagraphId}/snapshots/${value}`
                : `/snapshots/${value}`
            }
          >
            {value}
          </Link>
        ),
        fee: (value, record) => (
          <FormatCurrency
            value={value}
            currency={getMetagraphCurrencySymbol(
              network,
              record.metagraphId,
              true
            )}
          />
        ),
        source: (value) => (
          <span className="flex items-center gap-1">
            <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
              {shortenString(value)}
            </Link>
            <CopyAction value={value} />
          </span>
        ),
        destination: (value) => (
          <span className="flex items-center gap-1">
            <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
              {shortenString(value)}
            </Link>
            <CopyAction value={value} />
          </span>
        ),
        amount: (value, record) => (
          <span className="flex flex-col gap-1">
            <FormatCurrency
              value={datumToDag(value)}
              currency={getMetagraphCurrencySymbol(network, record.metagraphId)}
            />
            <FormatCurrencyPrice
              className="text-gray-600"
              network={network}
              value={datumToDag(value)}
              currencyId={record.metagraphId}
            />
          </span>
        ),
      }}
    />
  );
};
