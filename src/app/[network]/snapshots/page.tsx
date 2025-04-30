import dayjs from "dayjs";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts/network";
import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getSnapshots } from "@/queries";
import {
  INextTokenPaginationSearchParams,
} from "@/types";
import { getPageSearchParamsOrDefaults, parseNumberOrDefault } from "@/utils";

export const revalidate = 15;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function SnapshotsPage({
  params,
  searchParams,
}: {
  params: Promise<{ network: string }>;
  searchParams: Promise<INextTokenPaginationSearchParams>;
}) {
  const network = await getNetworkFromParamsOrFail(params);

  const [{ limit }] = await getPageSearchParamsOrDefaults(searchParams, {
    limit: "10",
  });

  const snapshots = getSnapshots(network, undefined, {
    tokenPagination: { limit: parseNumberOrDefault(limit, 10) },
  });

  return (
    <>
      <PageLayout
        className="flex flex-col gap-10 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <Section title="Snapshots">
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={snapshots.then((data) => data.records)}
            primaryKey="ordinal"
            titles={{
              ordinal: "Ordinal",
              timestamp: "Timestamp",
              blocks: "Blocks",
              rewards: "Rewards",
            }}
            loadingData={SkeletonSpan.generateTableRecords(5, [
              "ordinal",
              "timestamp",
              "blocks",
              "rewards",
            ])}
            // pagination={buildPaginationForAPIResponseArray(
            //   snapshots,
            //   tokenPagination.limit ?? 10
            // )}
            emptyState={<EmptyState label="No snapshots detected" />}
            format={{
              ordinal: (value) => (
                <Link
                  className="text-hgtp-blue-600"
                  href={`/snapshots/${value}`}
                >
                  {value}
                </Link>
              ),
              timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
              blocks: (value) => <span>{value.length}</span>,
              rewards: (value) => (
                <FormatCurrency
                  currency="DAG"
                  value={datumToDag(
                    value?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0
                  )}
                />
              ),
            }}
          />
        </Section>
      </PageLayout>
    </>
  );
}
