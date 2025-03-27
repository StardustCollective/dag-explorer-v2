import dayjs from "dayjs";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts/network";
import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { getTransactions } from "@/queries";
import { shortenString } from "@/utils";

export const revalidate = 15;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function TransactionsPage({
  params,
}: {
  params: Promise<{ network: string }>;
}) {
  const network = await getNetworkFromParamsOrFail(params);

  const transactions = getTransactions(network, undefined, {
    tokenPagination: { limit: 10 },
  });

  return (
    <>
      <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
        <Section title="Transactions">
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={transactions}
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
            format={{
              hash: (value, record) => (
                <Link
                  className="text-hgtp-blue-600"
                  href={
                    record.metagraphId
                      ? `/metagraphs/${record.metagraphId}/transactions/${value}`
                      : `/transactions/${value}`
                  }
                >
                  {shortenString(value)} <CopyAction value={value} />
                </Link>
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
              fee: (value) => (
                <FormatCurrency currency="dDAG" value={value} />
              ),
              source: (value) => (
                <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
                  {shortenString(value)} <CopyAction value={value} />
                </Link>
              ),
              destination: (value) => (
                <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
                  {shortenString(value)} <CopyAction value={value} />
                </Link>
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
