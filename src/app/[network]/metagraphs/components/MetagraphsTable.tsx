"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import { HgtpNetwork } from "@/common/consts/network";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { RoundedIcon } from "@/components/RoundedIcon";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getMetagraphs } from "@/queries";
import { IMetagraphProject } from "@/types";
import {
  formatCurrencyWithDecimals,
  formatNumberWithDecimals,
  stringFormat,
} from "@/utils";

import ConstellationCircleGrayIcon from "@/assets/logos/constellation-circle-gray.svg";

export type IMetagraphsTableProps = {
  network: HgtpNetwork;
  limit?: number;
};

export const MetagraphsTable = ({ network, limit }: IMetagraphsTableProps) => {
  const [page, setPage] = useState(0);

  const query = useQuery({
    queryKey: ["metagraphs", network, limit, page],
    queryFn: () =>
      getMetagraphs(network, {
        limitPagination: { limit: limit ?? 10, offset: page * (limit ?? 10) },
      }),
  });

  return (
    <Table.Suspense
      className="w-full [&_td]:text-sm"
      data={
        query.data?.records.sort((a, b) => a.type.localeCompare(b.type)) ??
        ([] as IMetagraphProject[])
      }
      primaryKey="id"
      titles={{
        name: "Projects",
        type: "Type",
        snapshots90d: "Snapshots (90D)",
        fees90d: "Fees (90D)",
        feesTotal: "Total fees",
      }}
      loading={query.isLoading}
      loadingData={SkeletonSpan.generateTableRecords(5, [
        "name",
        "type",
        "snapshots90d",
        "fees90d",
        "feesTotal",
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
      colClassNames={{
        snapshots90d: "justify-end",
        fees90d: "justify-end",
        feesTotal: "justify-end",
      }}
      emptyState={<EmptyState label="No projects detected" />}
      format={{
        name: (value, record) => (
          <Link
            className="flex flex-row gap-3 items-center text-hgtp-blue-600 font-medium"
            href={
              record.metagraphId !== null
                ? `/metagraphs/${record.metagraphId}`
                : "#"
            }
          >
            <RoundedIcon
              iconUrl={record.icon_url}
              fallback={
                <ConstellationCircleGrayIcon className="size-8 shrink-0" />
              }
              size={8}
            />
            {value}
          </Link>
        ),
        type: (value) => (
          <span
            className={clsx(
              "flex items-center px-3 py-1 rounded-3xl w-fit text-xs font-medium",
              value === "public" && "bg-hgtp-blue-50",
              value === "private" && "bg-gray-100"
            )}
          >
            {stringFormat(value, "TITLE_CASE")}
          </span>
        ),
        snapshots90d: (value) => (
          <span>
            {value === null
              ? "Hidden"
              : formatNumberWithDecimals(value, { maxD: 0 })}
          </span>
        ),
        fees90d: (value) => (
          <span>
            {value === null
              ? "Hidden"
              : formatCurrencyWithDecimals("DAG", (value ?? 0) / 1e8, {
                  maxD: 0,
                })}
          </span>
        ),
        feesTotal: (value) => (
          <span>
            {value === null
              ? "Hidden"
              : formatCurrencyWithDecimals("DAG", (value ?? 0) / 1e8, {
                  maxD: 0,
                })}
          </span>
        ),
      }}
    />
  );
};
