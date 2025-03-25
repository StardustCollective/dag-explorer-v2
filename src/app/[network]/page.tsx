import { dag4 } from "@stardust-collective/dag4";
import clsx from "clsx";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts/network";
import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PageLayout } from "@/components/PageLayout";
import { RouterRefresh } from "@/components/RouterRefresh";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { StatCard } from "@/components/StatCard";
import { Table } from "@/components/Table";
import { ValidatorCard } from "@/components/ValidatorCard";
import {
  getLatestMetagraphSnapshots,
  getLatestMetagraphTransactions,
  getLatestSnapshots,
  getLatestTransactions,
  getMetagraphCurrencySymbol,
  getMetagraphs,
  getStakingDelegators,
} from "@/queries";
import {
  encodeDecimal,
  formatCurrencyWithDecimals,
  formatNumberWithDecimals,
  shortenString,
  stringFormat,
} from "@/utils";

import ConstellationCircleGrayIcon from "@/assets/logos/constellation-circle-gray.svg";

export const revalidate = 15;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ network: string }>;
}) {
  const network = await getNetworkFromParamsOrFail(params);

  const metagraphs = getMetagraphs(network, { pagination: { limit: 5 } });

  const dagSnapshots = getLatestSnapshots(network, {
    pagination: { limit: 5 },
  });
  const dagTransactions = getLatestTransactions(network, {
    pagination: { limit: 5 },
  });

  const metagraphSnapshots = getLatestMetagraphSnapshots(network, {
    pagination: { limit: 5 },
  });
  const metagraphTransactions = getLatestMetagraphTransactions(network, {
    pagination: { limit: 5 },
  });

  const validators = await getStakingDelegators(network);

  return (
    <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
      <RouterRefresh interval={1000 * 15} />
      <Section title="Explorer stats" className="flex flex-nowrap gap-6">
        <StatCard label="Total Snapshots">
          {formatNumberWithDecimals(Date.now() / 1000, { max: 0 })}
        </StatCard>
        <StatCard label="Total Dag Locked">
          {formatCurrencyWithDecimals("DAG", 100 * 1e6)}
        </StatCard>
        <StatCard label="Total Snapshots Fees (90D)">
          {formatCurrencyWithDecimals("DAG", 350_132)}
        </StatCard>
        <StatCard label="Total Snapshots Fees">
          {formatCurrencyWithDecimals("DAG", 3_350_132)}
        </StatCard>
      </Section>
      <Section title="Top validators" className="flex flex-nowrap gap-6">
        {validators.slice(0, 3).map((validator) => (
          <ValidatorCard
            key={validator.node}
            nodeId={validator.node}
            type={"validator"}
            subtitle={validator.nodeMetadataParameters.name}
            title={shortenString(
              dag4.keyStore.getDagAddressFromPublicKey(validator.node)
            )}
            logoUrl="https://icons-metagraph.s3.amazonaws.com/DOR/dortoken_red.svg"
            delegatedAmountInDAG={encodeDecimal(validator.totalStaked / 1e8)}
            commissionPercentage={
              validator.delegatedStakeRewardParameters.rewardFraction / 1000
            }
            description={validator.nodeMetadataParameters.description}
          />
        ))}
      </Section>
      <Section title="Top projects">
        <Table.Suspense
          className="w-full [&_td]:text-sm"
          data={metagraphs.then((data) =>
            data.sort((a, b) => a.type.localeCompare(b.type))
          )}
          primaryKey="id"
          titles={{
            name: "Projects",
            type: "Type",
            snapshots90d: "Snapshots (90D)",
            fees90d: "Fees (90D)",
            feesTotal: "Total Fees",
          }}
          loadingData={SkeletonSpan.generateTableRecords(5, [
            "name",
            "type",
            "snapshots90d",
            "fees90d",
            "feesTotal",
          ])}
          format={{
            name: (value, record) => (
              <Link
                className="flex flex-row gap-3 items-center text-hgtp-blue-600 font-medium"
                href={
                  record.metagraphId !== null
                    ? `/metagraph/${record.metagraphId}`
                    : "#"
                }
              >
                <div className="size-8 rounded-full">
                  {record.icon_url && (
                    <Image
                      className="object-contain size-8"
                      src={record.icon_url}
                      alt={value}
                      width={32}
                      height={32}
                    />
                  )}
                  {!record.icon_url && (
                    <ConstellationCircleGrayIcon className="size-8" />
                  )}
                </div>
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
                {value === null ? "Hidden" : formatNumberWithDecimals(value)}
              </span>
            ),
            fees90d: (value) => (
              <span>
                {value === null
                  ? "Hidden"
                  : formatCurrencyWithDecimals("DAG", (value ?? 0) / 1e8)}
              </span>
            ),
            feesTotal: (value) => (
              <span>
                {value === null
                  ? "Hidden"
                  : formatCurrencyWithDecimals("DAG", (value ?? 0) / 1e8)}
              </span>
            ),
          }}
        />
      </Section>
      <div className="flex gap-6">
        <Section
          title="Latest DAG snapshots"
          className={{ wrapper: "w-1/2", children: "flex flex-col gap-5" }}
        >
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={dagSnapshots}
            primaryKey="ordinal"
            titles={{
              ordinal: "Ordinal",
              timestamp: "Timestamp",
              blocks: "Blocks",
            }}
            loadingData={SkeletonSpan.generateTableRecords(5, [
              "ordinal",
              "timestamp",
              "blocks",
            ])}
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
            }}
          />
          <Link
            href="/snapshots"
            className="button primary outlined md w-full bg-transparent"
          >
            View all DAG snapshots
          </Link>
        </Section>
        <Section
          title="Latest DAG transactions"
          className={{ wrapper: "w-1/2", children: "flex flex-col gap-5" }}
        >
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={dagTransactions}
            primaryKey="hash"
            titles={{
              hash: "Txn Hash",
              timestamp: "Timestamp",
              amount: "Amount",
            }}
            loadingData={SkeletonSpan.generateTableRecords(5, [
              "hash",
              "timestamp",
              "amount",
            ])}
            format={{
              hash: (value) => (
                <Link
                  className="text-hgtp-blue-600"
                  href={`/transactions/${value}`}
                >
                  {shortenString(value)}
                </Link>
              ),
              timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
              amount: (value, record) => (
                <FormatCurrency
                  value={datumToDag(value)}
                  currency={getMetagraphCurrencySymbol(
                    network,
                    record.metagraphId
                  )}
                />
              ),
            }}
          />
          <Link
            href="/transactions"
            className="button primary outlined md w-full bg-transparent"
          >
            View all DAG transactions
          </Link>
        </Section>
      </div>
      <div className="flex gap-6">
        <Section
          title="Latest metagraph snapshots"
          className={{ wrapper: "w-1/2", children: "flex flex-col gap-5" }}
        >
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={metagraphSnapshots}
            primaryKey="ordinal"
            titles={{
              metagraphName: "Metagraph",
              ordinal: "Ordinal",
              timestamp: "Timestamp",
              blocks: "Blocks",
            }}
            loadingData={SkeletonSpan.generateTableRecords(5, [
              "metagraphName",
              "ordinal",
              "timestamp",
              "blocks",
            ])}
            format={{
              metagraphName: (value, record) => (
                <Link
                  className="text-hgtp-blue-600"
                  href={`/metagraphs/${record.metagraphId}`}
                >
                  {record.symbol}
                </Link>
              ),
              ordinal: (value, record) => (
                <Link
                  className="text-hgtp-blue-600"
                  href={`/metagraphs/${record.metagraphId}/snapshots/${value}`}
                >
                  {value}
                </Link>
              ),
              timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
              blocks: (value) => <span>{value.length}</span>,
            }}
            colWidths={{
              timestamp: 1.5,
            }}
          />
        </Section>
        <Section
          title="Latest metagraph transactions"
          className={{ wrapper: "w-1/2", children: "flex flex-col gap-5" }}
        >
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={metagraphTransactions}
            primaryKey="hash"
            titles={{
              hash: "Txn Hash",
              timestamp: "Timestamp",
              amount: "Amount",
            }}
            loadingData={SkeletonSpan.generateTableRecords(5, [
              "hash",
              "timestamp",
              "amount",
            ])}
            format={{
              hash: (value, record) => (
                <Link
                  className="text-hgtp-blue-600"
                  href={`/metagraphs/${record.metagraphId}/transactions/${value}`}
                >
                  {shortenString(value)}
                </Link>
              ),
              timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
              amount: (value, record) => (
                <FormatCurrency
                  value={datumToDag(value)}
                  currency={getMetagraphCurrencySymbol(
                    network,
                    record.metagraphId
                  )}
                />
              ),
            }}
          />
        </Section>
      </div>
    </PageLayout>
  );
}
