import dayjs from "dayjs";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts/network";
import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getTransactions } from "@/queries";
import {
  INextTokenPaginationSearchParams,
} from "@/types";
import {
  getPageSearchParamsOrDefaults,
  parseNumberOrDefault,
  shortenString,
} from "@/utils";

export const revalidate = 15;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function TransactionsPage({
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

  const transactions = getTransactions(network, undefined, {
    tokenPagination: { limit: parseNumberOrDefault(limit, 10) },
  });

  return (
    <>
      <PageLayout
        className="flex flex-col gap-10 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <Section title="Transactions">
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={transactions.then((data) => data.records)}
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
            loadingData={SkeletonSpan.generateTableRecords(3, [
              "hash",
              "timestamp",
              "snapshotOrdinal",
              "fee",
              "source",
              "destination",
              "amount",
            ])}
            // pagination={buildPaginationForAPIResponseArray(
            //   transactions,
            //   tokenPagination.limit ?? 10
            // )}
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
              fee: (value) => <FormatCurrency currency="dDAG" value={value} />,
              source: (value) => (
                <span className="flex items-center gap-1">
                  <Link
                    className="text-hgtp-blue-600"
                    href={`/address/${value}`}
                  >
                    {shortenString(value)}
                  </Link>
                  <CopyAction value={value} />
                </span>
              ),
              destination: (value) => (
                <span className="flex items-center gap-1">
                  <Link
                    className="text-hgtp-blue-600"
                    href={`/address/${value}`}
                  >
                    {shortenString(value)}
                  </Link>
                  <CopyAction value={value} />
                </span>
              ),
              amount: (value) => (
                <FormatCurrency currency="DAG" value={datumToDag(value)} />
              ),
            }}
          />
        </Section>
      </PageLayout>
    </>
  );
}
