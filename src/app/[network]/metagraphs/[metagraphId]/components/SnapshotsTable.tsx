"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Pagination } from "@/components/Pagination";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getSnapshots } from "@/queries";
import { IAPISnapshot } from "@/types";

export type ISnapshotsTableProps = {
  network: HgtpNetwork;
  metagraphId: string;
  limit?: number;
};

export const SnapshotsTable = ({
  network,

  metagraphId,
  limit,
}: ISnapshotsTableProps) => {
  const [page, setPage] = useState(0);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  const query = useQuery({
    queryKey: ["snapshots", network, metagraphId, limit, page],
    queryFn: () =>
      getSnapshots(network, metagraphId, {
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
      data={query.data?.records ?? ([] as IAPISnapshot[])}
      primaryKey="ordinal"
      titles={{
        ordinal: "Ordinal",
        timestamp: "Timestamp",
        rewards: "Rewards",
        sizeInKb: "Snapshot Size",
        fee: "Snapshot Fee",
      }}
      loading={query.isLoading}
      loadingData={SkeletonSpan.generateTableRecords(5, [
        "ordinal",
        "timestamp",
        "rewards",
        "sizeInKb",
        "fee",
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
      emptyState={<EmptyState label="No snapshots detected" />}
      format={{
        ordinal: (value) => (
          <Link
            className="text-hgtp-blue-600"
            href={`/metagraphs/${metagraphId}/snapshots/${value}`}
          >
            {value}
          </Link>
        ),
        timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
        rewards: (value) => (
          <FormatCurrency
            currency="DAG"
            value={datumToDag(
              value?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0
            )}
          />
        ),
        sizeInKb: (value) => <span>{value ?? 0}kb</span>,
        fee: (value) => <FormatCurrency currency="dDAG" value={value ?? 0} />,
      }}
    />
  );
};
