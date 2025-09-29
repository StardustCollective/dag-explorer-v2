"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

import { TypeChip } from "./TypeChip";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Pagination } from "@/components/Pagination";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getAddressActions, getMetagraphCurrencySymbol } from "@/queries";
import { IAPIGeneralActionTransaction } from "@/types";
import { shortenString } from "@/utils";

import CryptoIcon from "@/assets/icons/crypto.svg";

export type IActionsTableProps = {
  network: HgtpNetwork;
  addressId: string;
  metagraphId?: string;
  limit?: number;
};

export const ActionsTable = ({
  network,
  addressId,
  metagraphId,
  limit,
}: IActionsTableProps) => {
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const query = useQuery({
    queryKey: ["actions", network, addressId, metagraphId, limit, page],
    queryFn: () =>
      getAddressActions(network, addressId, metagraphId, {
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
      data={query.data?.records ?? ([] as IAPIGeneralActionTransaction[])}
      primaryKey="hash"
      titles={{
        hash: "Txn Hash",
        type: "Type",
        source: "Source",
        parentHash: "Parent Txn",
        timestamp: "Timestamp",
        amount: "Amount",
      }}
      loading={query.isLoading}
      loadingData={SkeletonSpan.generateTableRecords(3, [
        "hash",
        "type",
        "source",
        "parentHash",
        "timestamp",
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
      emptyState={
        <EmptyState renderIcon={CryptoIcon} label="No actions detected" />
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
          <span className={"flex items-center w-full"}>
            {value === "FeeTransaction" ? (
              <TypeChip className="text-violet-700 border-purple-400">
                {value}
              </TypeChip>
            ) : value === "TokenLock" ? (
              <TypeChip className="text-gray-600 border-gray-400">
                {value}
              </TypeChip>
            ) : value === "TokenUnlock" ? (
              <TypeChip className="text-yellow-700 border-yellow-500">
                {value}
              </TypeChip>
            ): value === "DelegateStakeCreate" ? (
              <TypeChip className="text-gray-600 border-gray-400">
                {value}
              </TypeChip>
            ) : value === "DelegateStakeWithdraw" ? (
              <TypeChip className="text-yellow-700 border-yellow-500">
                {value}
              </TypeChip>
            ) : value === "AllowSpend" ? (
              <TypeChip className="text-blue-700 border-blue-400">
                {value}
              </TypeChip>
            ) : value === "SpendTransaction" ? (
              <TypeChip className="text-green-700 border-green-400">
                {value}
              </TypeChip>
            ) : value === "ExpiredAllowSpend" ? (
              <TypeChip className="text-red-700 border-red-400">
                {value}
              </TypeChip>
            ) : (
              <TypeChip className="text-hgtp-blue-700 border-hgtp-blue-400">
                {value}
              </TypeChip>
            )}
          </span>
        ),
        source: (value) => (
          <span className="flex items-center gap-1">
            <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
              {shortenString(value)}
            </Link>
            <CopyAction value={value} />
          </span>
        ),
        parentHash: (value, record) =>
          value ? (
            <span className="flex items-center gap-1">
              {/* <Link
                className="text-hgtp-blue-600"
                href={
                  record.metagraphId
                    ? `/metagraphs/${record.metagraphId}/transactions/${value}`
                    : `/transactions/${value}`
                }
              >
                {shortenString(value)}
              </Link> */}
              {shortenString(value)}
              <CopyAction value={value} />
            </span>
          ) : (
            "--"
          ),
        timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
        amount: (value, record) => (
          <FormatCurrency
            value={datumToDag(value)}
            currency={getMetagraphCurrencySymbol(network, record.metagraphId)}
          />
        ),
      }}
    />
  );
};
