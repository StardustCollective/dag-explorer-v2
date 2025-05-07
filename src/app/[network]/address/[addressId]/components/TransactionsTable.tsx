"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import Link from "next/link";
import { useState } from "react";

import { TypeChip } from "./TypeChip";

import { HgtpNetwork } from "@/common/consts";
import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Pagination } from "@/components/Pagination";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getAddressTransactions, getMetagraphCurrencySymbol } from "@/queries";
import { IAPITransaction } from "@/types";
import { decodeDecimal, shortenString } from "@/utils";

export type ITransactionsTableProps = {
  network: HgtpNetwork;
  addressId: string;
  metagraphId?: string;
  limit?: number;
};

export const TransactionsTable = ({
  network,
  addressId,
  metagraphId,
  limit,
}: ITransactionsTableProps) => {
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const query = useQuery({
    queryKey: ["transactions", network, addressId, metagraphId, limit, page],
    queryFn: () =>
      getAddressTransactions(network, addressId, metagraphId, {
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
        snapshotHash: "",
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
        "snapshotHash",
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
        snapshotHash: (value, record) => (
          <span className="items-center justify-center w-full uppercase hidden lg:flex">
            {record.source === addressId ? (
              <TypeChip className="text-hgtp-blue-700 border-hgtp-blue-200">
                Out
              </TypeChip>
            ) : (
              <TypeChip className="text-green-800 border-green-300">
                In
              </TypeChip>
            )}
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
          <FormatCurrency
            value={decodeDecimal(value).div(Decimal.pow(10, 8))}
            currency={getMetagraphCurrencySymbol(network, record.metagraphId)}
          />
        ),
      }}
    />
  );
};
