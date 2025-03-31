import { dag4 } from "@stardust-collective/dag4";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MetagraphSelect } from "./components/MetagraphSelect";
import { TypeChip } from "./components/TypeChip";

import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { FormatCurrencyPrice } from "@/components/FormatCurrencyPrice";
import { MetagraphIcon } from "@/components/MetagraphIcon";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { SuspenseValue } from "@/components/SuspenseValue";
import { Table } from "@/components/Table";
import { Tab, Tabs } from "@/components/Tabs";
import {
  getAddressActions,
  getAddressBalance,
  getAddressMetagraphs,
  getAddressRewards,
  getAddressTransactions,
  getMetagraphCurrencySymbol,
} from "@/queries";
import { IAPIAddressMetagraph } from "@/types";
import { buildSearchParams, decodeDecimal, shortenString } from "@/utils";

type IAddressPageProps = {
  params: Promise<{ network: string; addressId: string }>;
  searchParams: Promise<{ section?: string; metagraphId?: string }>;
};

export const revalidate = 30;

export async function generateMetadata({
  params,
}: IAddressPageProps): Promise<Metadata> {
  const { addressId } = await params;

  return {
    title: `Address ${shortenString(addressId)} - DAG Explorer`,
    description: `Address Details ${addressId} - DAG Explorer`,
  };
}

export default async function AddressPage({
  params,
  searchParams,
}: IAddressPageProps) {
  const { addressId } = await params;
  const { section = "transactions", metagraphId = "" } = await searchParams;
  const nextSearchParams = buildSearchParams({ section, metagraphId });

  const network = await getNetworkFromParamsOrFail(params);

  if (!dag4.keyStore.validateDagAddress(addressId)) {
    throw notFound();
  }

  const balance = await getAddressBalance(network, addressId);

  const addressMetagraphs = getAddressMetagraphs(network, addressId);

  const transactions = getAddressTransactions(network, addressId, metagraphId, {
    tokenPagination: { limit: 10 },
  });

  const rewards = getAddressRewards(network, addressId, metagraphId, {
    pagination: { limit: 10 },
  });

  const actions = getAddressActions(network, addressId);

  return (
    <>
      <PageTitle
        rightContent={
          <MetagraphSelect
            address={addressId}
            network={network}
            metagraphId={metagraphId}
            metagraphs={addressMetagraphs}
          />
        }
      >
        Address details
      </PageTitle>
      <PageLayout className="flex flex-col gap-4 px-20 py-8" renderAs={"main"}>
        <Section className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card flex flex-col gap-4 p-6">
              <span className="text-hgtp-blue-900 font-medium text-xl">
                DAG Address
              </span>
              <span className="text-hgtp-blue-600 font-medium text-lg">
                {addressId} <CopyAction value={addressId} />
              </span>
            </div>
            <div className="card flex flex-col gap-4 p-6">
              <span className="text-hgtp-blue-900 font-medium text-xl">
                Total DAG Balance
              </span>
              <span className="text-hgtp-blue-950 text-lg">
                <FormatCurrency currency="DAG" value={datumToDag(balance)} />{" "}
                <FormatCurrencyPrice
                  className="text-gray-500"
                  network={network}
                  value={datumToDag(balance)}
                />
              </span>
            </div>
          </div>
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            header={
              <div className="flex gap-2 px-5 py-3.5 text-xl font-medium">
                Tokens
              </div>
            }
            data={addressMetagraphs.then((data) =>
              [
                {
                  metagraphId: "native",
                  name: "DAG",
                  symbol: "DAG",
                  iconUrl: null,
                } satisfies IAPIAddressMetagraph,
                ...data,
              ].map((r) => ({
                ...r,
                balance: getAddressBalance(
                  network,
                  addressId,
                  r.metagraphId === "native" ? undefined : r.metagraphId
                ),
                lockedAmount: 0,
                totalAmount: 0,
              }))
            )}
            primaryKey="metagraphId"
            titles={{
              name: "Token",
              symbol: "Symbol",
              lockedAmount: "Locked Amount",
              balance: "Available Amount",
              totalAmount: "Total Amount",
            }}
            loadingData={SkeletonSpan.generateTableRecords(3, [
              "name",
              "symbol",
              "lockedAmount",
              "balance",
              "totalAmount",
            ])}
            format={{
              name: (value, record) => (
                <Link
                  href={
                    record.metagraphId === "native"
                      ? `#`
                      : `/metagraphs/${record.metagraphId}`
                  }
                  className="flex items-center gap-2 text-hgtp-blue-600"
                >
                  <MetagraphIcon
                    network={network}
                    iconUrl={record.iconUrl}
                    size={6}
                  />
                  {value}
                </Link>
              ),
              balance: (value, record) => (
                <FormatCurrency
                  currency={record.symbol}
                  value={record.balance.then((v) => datumToDag(v))}
                />
              ),
              lockedAmount: (value, record) => (
                <FormatCurrency
                  currency={record.symbol}
                  value={datumToDag(value)}
                />
              ),
              totalAmount: (value, record) => (
                <FormatCurrency
                  currency={record.symbol}
                  value={record.balance.then((v) => datumToDag(v))}
                />
              ),
            }}
          />
          <div className="card flex flex-col w-full">
            <Tabs value={section}>
              <Tab
                id="transactions"
                href={`/address/${addressId}?${nextSearchParams({
                  section: "",
                })}`}
              >
                <SuspenseValue
                  value={getMetagraphCurrencySymbol(network, metagraphId)}
                  fallback="DAG"
                />{" "}
                Transactions
              </Tab>
              <Tab
                id="rewards"
                href={`/address/${addressId}?${nextSearchParams({
                  section: "rewards",
                })}`}
              >
                <SuspenseValue
                  value={getMetagraphCurrencySymbol(network, metagraphId)}
                  fallback="DAG"
                />{" "}
                Rewards
              </Tab>
              <Tab
                id="actions"
                href={`/address/${addressId}?${nextSearchParams({
                  section: "actions",
                })}`}
              >
                Actions
              </Tab>
              {/* <Tab id="locks" href={`/address/${addressId}?section=locks`}>
                Active Locks
              </Tab> */}
            </Tabs>
            {section === "transactions" && (
              <Table.Suspense
                noCardStyle
                className="w-full [&_td]:text-sm"
                header={<span></span>}
                data={transactions}
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
                    <Link
                      className="text-hgtp-blue-600"
                      href={`/address/${value}`}
                    >
                      {shortenString(value)} <CopyAction value={value} />
                    </Link>
                  ),
                  snapshotHash: (value, record) => (
                    <span className={"flex items-center justify-center w-full"}>
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
                    <Link
                      className="text-hgtp-blue-600"
                      href={`/address/${value}`}
                    >
                      {shortenString(value)} <CopyAction value={value} />
                    </Link>
                  ),
                  amount: (value, record) => (
                    <FormatCurrency
                      value={decodeDecimal(value).div(Decimal.pow(10, 8))}
                      currency={getMetagraphCurrencySymbol(
                        network,
                        record.metagraphId
                      )}
                    />
                  ),
                }}
              />
            )}
            {section === "rewards" && (
              <Table.Suspense
                noCardStyle
                className="w-full [&_td]:text-sm"
                header={<span></span>}
                data={rewards}
                primaryKey="accruedAt"
                titles={{
                  address: "Sent to",
                  rewardsCount: "Rewards Txns",
                  amount: "Daily Total",
                  accruedAt: "Date",
                }}
                loadingData={SkeletonSpan.generateTableRecords(3, [
                  "address",
                  "rewardsCount",
                  "amount",
                  "accruedAt",
                ])}
                format={{
                  address: (value) => (
                    <Link
                      className="text-hgtp-blue-600"
                      href={`/address/${value}`}
                    >
                      {shortenString(value)} <CopyAction value={value} />
                    </Link>
                  ),
                  accruedAt: (value) => (
                    <span>{dayjs(value).format("YYYY-MM-DD")}</span>
                  ),
                  amount: (value, record) => (
                    <FormatCurrency
                      value={decodeDecimal(value).div(Decimal.pow(10, 8))}
                      currency={getMetagraphCurrencySymbol(
                        network,
                        record.metagraphId
                      )}
                    />
                  ),
                }}
              />
            )}
            {section === "actions" && (
              <Table.Suspense
                noCardStyle
                className="w-full [&_td]:text-sm"
                header={<span></span>}
                data={actions}
                primaryKey="hash"
                titles={{
                  hash: "Txn Hash",
                  type: "Type",
                  source: "Source",
                  parentHash: "Parent Txn",
                  timestamp: "Timestamp",
                  amount: "Amount",
                }}
                loadingData={SkeletonSpan.generateTableRecords(3, [
                  "hash",
                  "type",
                  "source",
                  "parentHash",
                  "timestamp",
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
                  type: (value) => (
                    <span className={"flex items-center w-full"}>
                      {value === "FeeTransaction" ? (
                        <TypeChip className="text-purple-700 border-purple-400">
                          {value}
                        </TypeChip>
                      ) : value === "TokenLock" ? (
                        <TypeChip className="text-ltx-gold-700 border-yellow-400">
                          {value}
                        </TypeChip>
                      ) : value === "TokenUnlock" ? (
                        <TypeChip className="text-green-700 border-green-400">
                          {value}
                        </TypeChip>
                      ) : value === "AllowSpend" ? (
                        <TypeChip className="text-black/65 border-gray-400">
                          {value}
                        </TypeChip>
                      ) : value === "SpendTransaction" ? (
                        <TypeChip className="text-hgtp-blue-600 border-hgtp-blue-400">
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
                    <Link
                      className="text-hgtp-blue-600"
                      href={`/address/${value}`}
                    >
                      {shortenString(value)} <CopyAction value={value} />
                    </Link>
                  ),
                  parentHash: (value, record) =>
                    value ? (
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
                    ) : (
                      "--"
                    ),
                  timestamp: (value) => <span>{dayjs(value).fromNow()}</span>,
                  amount: (value, record) => (
                    <FormatCurrency
                      value={decodeDecimal(value).div(Decimal.pow(10, 8))}
                      currency={getMetagraphCurrencySymbol(
                        network,
                        record.metagraphId
                      )}
                    />
                  ),
                }}
              />
            )}
          </div>
        </Section>
      </PageLayout>
    </>
  );
}
