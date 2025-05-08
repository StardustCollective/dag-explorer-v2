import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts/network";
import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { FormatCurrencyPrice } from "@/components/FormatCurrencyPrice";
import { NetworksOnly } from "@/components/NetworksOnly";
import { PageLayout } from "@/components/PageLayout";
import { RoundedIcon } from "@/components/RoundedIcon";
import { RouterRefresh } from "@/components/RouterRefresh";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { StatCard } from "@/components/StatCard";
import { SuspenseValue } from "@/components/SuspenseValue";
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
  getNetworkStats,
} from "@/queries";
import {
  decodeDecimal,
  formatCurrencyWithDecimals,
  formatNumberWithDecimals,
  shortenString,
  stringFormat,
} from "@/utils";

import Server1FilledIcon from "@/assets/icons/server-1-filled.svg";
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

  const metagraphs = getMetagraphs(network, { limitPagination: { limit: 5 } });

  const dagSnapshots = getLatestSnapshots(network, {
    limitPagination: { limit: 5 },
  });
  const dagTransactions = getLatestTransactions(network, {
    limitPagination: { limit: 5 },
  });

  const metagraphSnapshots = getLatestMetagraphSnapshots(network, {
    limitPagination: { limit: 5 },
  });
  const metagraphTransactions = getLatestMetagraphTransactions(network, {
    limitPagination: { limit: 5 },
  });

  const validators = getStakingDelegators(network);

  const stats = getNetworkStats(network);

  return (
    <PageLayout
      className="flex flex-col gap-10 px-4 lg:px-20 py-8"
      renderAs={"main"}
    >
      <RouterRefresh interval={1000 * 15} />
      <NetworksOnly network={network} exceptOn={[HgtpNetwork.MAINNET_1]}>
        <Section
          title="Explorer stats"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            label="Total Snapshots"
            tooltip="Total number of snapshots processed by the network"
          >
            <SuspenseValue
              value={stats.then((stats) =>
                formatNumberWithDecimals(stats?.snapshotsTotal, {
                  maxD: 0,
                  millifyFrom: 500 * 1e6,
                })
              )}
              fallback="--"
            />
          </StatCard>
          <StatCard
            label="Total Dag Locked"
            tooltip="Total amount of DAG locked has collateral for nodes and as delegated positions"
          >
            <FormatCurrency
              currency="DAG"
              decimals={{ max: 2 }}
              millifyFrom={1e6}
              value={stats.then(async (stats) => {
                const validators = await getStakingDelegators(network);
                return datumToDag(
                  (stats?.totalLockedInDatum ?? 0) +
                    validators.reduce(
                      (pv, cv) => pv + cv.totalAmountDelegated,
                      0
                    )
                );
              })}
            />
          </StatCard>
          <StatCard
            label="Total Snapshots Fees (90D)"
            tooltip="Total amount of snapshot fees paid by metagraphs to the network in the last 90 days"
          >
            <FormatCurrency
              currency="DAG"
              decimals={{ max: 2 }}
              millifyFrom={1e6}
              value={stats.then((stats) =>
                datumToDag(stats?.snapshots90d ?? 0)
              )}
            />
          </StatCard>
          <StatCard
            label="Total Snapshots Fees"
            tooltip="Total amount of snapshot fees paid by metagraphs to the network"
          >
            <FormatCurrency
              currency="DAG"
              decimals={{ max: 2 }}
              millifyFrom={1e6}
              value={stats.then((stats) => datumToDag(stats?.feesTotal ?? 0))}
            />
          </StatCard>
        </Section>
      </NetworksOnly>
      <NetworksOnly
        network={network}
        exceptOn={[HgtpNetwork.MAINNET, HgtpNetwork.MAINNET_1]}
      >
        <SuspenseValue
          renderAs={"div"}
          value={validators.then((validators) => (
            <Section
              title="Top validators"
              action={
                <Link href="/staking" className="text-hgtp-blue-600 text-lg">
                  View delegated staking
                </Link>
              }
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {validators.length === 0 ? (
                <EmptyState
                  className="h-[100px]"
                  variant="dark"
                  label="No validators detected"
                  renderIcon={Server1FilledIcon}
                />
              ) : (
                validators
                  .slice(0, 3)
                  .map((validator) => (
                    <ValidatorCard
                      key={validator.peerId}
                      nodeId={validator.peerId}
                      type={validator.metagraphNode ? "metagraph" : "validator"}
                      title={validator.nodeMetadataParameters.name}
                      subtitle={validator.metagraphNode?.name}
                      iconUrl={validator.metagraphNode?.iconUrl ?? undefined}
                      delegatedAmountInDAG={datumToDag(
                        validator.totalAmountDelegated
                      )}
                      commissionPercentage={decodeDecimal(
                        datumToDag(
                          validator.delegatedStakeRewardParameters
                            .rewardFraction
                        )
                      )
                        .mul(100)
                        .toNumber()}
                      description={validator.nodeMetadataParameters.description}
                    />
                  ))
              )}
            </Section>
          ))}
        />
      </NetworksOnly>
      <NetworksOnly network={network} exceptOn={[HgtpNetwork.MAINNET_1]}>
        <Section
          title="Top projects"
          action={
            <Link href="/metagraphs" className="text-hgtp-blue-600 text-lg">
              View projects
            </Link>
          }
        >
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={metagraphs.then((data) =>
              data.records.sort((a, b) => a.type.localeCompare(b.type))
            )}
            primaryKey="id"
            titles={{
              name: "Projects",
              type: "Type",
              snapshots90d: "Snapshots (90D)",
              fees90d: "Fees (90D)",
              feesTotal: "Total fees",
            }}
            loadingData={SkeletonSpan.generateTableRecords(5, [
              "name",
              "type",
              "snapshots90d",
              "fees90d",
              "feesTotal",
            ])}
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
                      <ConstellationCircleGrayIcon className="size-8" />
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
      </NetworksOnly>
      <div className="flex flex-wrap lg:flex-nowrap gap-6">
        <Section
          title="Latest DAG snapshots"
          className={{
            wrapper: "w-full lg:w-1/2",
            children: "flex flex-col gap-5",
          }}
        >
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={dagSnapshots.then((data) => data.records)}
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
          className={{
            wrapper: "w-full lg:w-1/2",
            children: "flex flex-col gap-5",
          }}
        >
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={dagTransactions.then((data) => data.records)}
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
            emptyState={<EmptyState label="No transactions detected" />}
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
                <span className="flex flex-col gap-1">
                  <FormatCurrency
                    value={datumToDag(value)}
                    currency={getMetagraphCurrencySymbol(
                      network,
                      record.metagraphId
                    )}
                  />
                  <FormatCurrencyPrice
                    className="text-gray-600"
                    network={network}
                    currencyId={record.metagraphId}
                    value={datumToDag(value)}
                  />
                </span>
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
      <NetworksOnly network={network} exceptOn={[HgtpNetwork.MAINNET_1]}>
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <Section
            title="Latest metagraph snapshots"
            className={{
              wrapper: "w-full lg:w-1/2",
              children: "flex flex-col gap-5",
            }}
          >
            <Table.Suspense
              className="w-full [&_td]:text-sm"
              data={metagraphSnapshots.then((data) => data.records)}
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
              emptyState={<EmptyState label="No snapshots detected" />}
              format={{
                metagraphName: (value, record) => (
                  <Link
                    className="text-hgtp-blue-600"
                    href={`/metagraphs/${record.metagraphId}`}
                  >
                    <SuspenseValue
                      value={getMetagraphCurrencySymbol(
                        network,
                        record.metagraphId
                      )}
                    />
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
            className={{
              wrapper: "w-full lg:w-1/2",
              children: "flex flex-col gap-5",
            }}
          >
            <Table.Suspense
              className="w-full [&_td]:text-sm"
              data={metagraphTransactions.then((data) => data.records)}
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
              emptyState={<EmptyState label="No transactions detected" />}
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
                  <span className="flex flex-col gap-1">
                    <FormatCurrency
                      value={datumToDag(value)}
                      currency={getMetagraphCurrencySymbol(
                        network,
                        record.metagraphId
                      )}
                    />
                    <FormatCurrencyPrice
                      className="text-gray-600"
                      network={network}
                      currencyId={record.metagraphId}
                      value={datumToDag(value)}
                    />
                  </span>
                ),
              }}
            />
          </Section>
        </div>
      </NetworksOnly>
    </PageLayout>
  );
}
