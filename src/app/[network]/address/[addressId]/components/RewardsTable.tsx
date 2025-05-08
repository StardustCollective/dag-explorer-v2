"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import Link from "next/link";
import { useState } from "react";

import { HgtpNetwork } from "@/common/consts";
import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Pagination } from "@/components/Pagination";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getAddressRewards, getMetagraphCurrencySymbol } from "@/queries";
import { IAPIAddressReward } from "@/types";
import { decodeDecimal, shortenString } from "@/utils";

import DiamondIcon from "@/assets/icons/diamond.svg";

export type IRewardsTableProps = {
  network: HgtpNetwork;
  addressId: string;
  metagraphId?: string;
  limit?: number;
};

export const RewardsTable = ({
  network,
  addressId,
  metagraphId,
  limit,
}: IRewardsTableProps) => {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ["rewards", network, addressId, metagraphId, limit, page],
    queryFn: () =>
      getAddressRewards(network, addressId, metagraphId, {
        limitPagination: { limit: limit ?? 10, offset: page * (limit ?? 10) },
      }),
  });

  return (
    <Table.Suspense
      noCardStyle
      className="w-full [&_td]:text-sm"
      header={<span></span>}
      data={query.data?.records ?? ([] as IAPIAddressReward[])}
      primaryKey="accruedAt"
      titles={{
        address: "Sent to",
        rewardsCount: "Rewards Txns",
        amount: "Daily Total",
        accruedAt: "Date",
      }}
      loading={query.isLoading}
      loadingData={SkeletonSpan.generateTableRecords(3, [
        "address",
        "rewardsCount",
        "amount",
        "accruedAt",
      ])}
      pagination={
        <Pagination
          pageSize={limit ?? 10}
          hasPrevPage={page > 0}
          hasNextPage={page < (query.data?.total ?? 0) / (limit ?? 10)}
          onNextPage={() => {
            setPage(page + 1);
          }}
          onPrevPage={() => setPage(page - 1)}
        />
      }
      emptyState={
        <EmptyState renderIcon={DiamondIcon} label="No rewards detected" />
      }
      format={{
        address: (value) => (
          <span className="flex items-center gap-1">
            <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
              {shortenString(value)}
            </Link>
            <CopyAction value={value} />
          </span>
        ),
        accruedAt: (value) => <span>{dayjs(value).format("YYYY-MM-DD")}</span>,
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
