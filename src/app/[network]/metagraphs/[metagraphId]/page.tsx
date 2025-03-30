import { dag4 } from "@stardust-collective/dag4";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NodeLayerInfo } from "./components/NodeLayerInfo";

import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { CopyAction } from "@/components/CopyAction";
import { FormatCurrency } from "@/components/FormatCurrency";
import { MetagraphIcon } from "@/components/MetagraphIcon";
import { PageLayout } from "@/components/PageLayout";
import { PropertiesCard } from "@/components/PropertiesCard";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import { Tab, Tabs } from "@/components/Tabs";
import {
  getMetagraph,
  getMetagraphCurrencySymbol,
  getMetagraphNodes,
  getSnapshots,
  getTransactions,
} from "@/queries";
import { decodeDecimal, shortenString } from "@/utils";

import Brain2Icon from "@/assets/icons/brain-2.svg";
import WalletIcon from "@/assets/icons/wallet.svg";

export const revalidate = 30;

export default async function MetagraphPage({
  params,
  searchParams,
}: {
  params: Promise<{ network: string; metagraphId: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { metagraphId } = await params;
  const { section = "snapshots" } = await searchParams;

  const network = await getNetworkFromParamsOrFail(params);

  if (!dag4.keyStore.validateDagAddress(metagraphId)) {
    throw notFound();
  }

  const metagraph = await getMetagraph(network, metagraphId);
  const nodes = getMetagraphNodes(network, metagraphId);

  if (!metagraph) {
    throw notFound();
  }

  const snapshots = getSnapshots(network, metagraphId, {
    tokenPagination: { limit: 10 },
  });

  const transactions = getTransactions(network, metagraphId, {
    tokenPagination: { limit: 10 },
  });

  return (
    <PageLayout className="flex flex-col gap-4 px-20 py-8" renderAs={"main"}>
      <Section className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex flex-col gap-2">
                <h3 className="flex items-center gap-3 text-hgtp-blue-950 font-semibold text-3xl">
                  <MetagraphIcon
                    network={network}
                    metagraphId={metagraphId}
                    size={8}
                  />{" "}
                  {metagraph.name}
                </h3>
                <p className="max-w-[700px]">{metagraph.description}</p>
              </div>
            </div>
            <PropertiesCard
              rows={[
                {
                  label: (
                    <span className="flex items-center gap-2 text-hgtp-blue-950">
                      <Brain2Icon className="text-black/65 size-5" /> Metagraph
                      ID
                    </span>
                  ),
                  value: (
                    <Link
                      href={`/address/${metagraph.id}`}
                      className="text-hgtp-blue-600"
                    >
                      {shortenString(metagraph.id, 4, 4)}
                      <CopyAction value={metagraph.id} />
                    </Link>
                  ),
                },
                {
                  label: (
                    <span className="flex items-center gap-2 text-hgtp-blue-950">
                      <WalletIcon className="text-black/65 size-5" /> Staking
                    </span>
                  ),
                  value: metagraph.stakingWalletAddress ? (
                    <Link
                      href={`/address/${metagraph.stakingWalletAddress}`}
                      className="text-hgtp-blue-600"
                    >
                      {shortenString(metagraph.stakingWalletAddress, 4, 4)}
                      <CopyAction value={metagraph.stakingWalletAddress} />
                    </Link>
                  ) : (
                    ""
                  ),
                },
                {
                  label: (
                    <span className="flex items-center gap-2 text-hgtp-blue-950">
                      <WalletIcon className="text-black/65 size-5" /> Snapshot
                      fees
                    </span>
                  ),
                  value: metagraph.feesWalletAddress ? (
                    <Link
                      href={`/address/${metagraph.feesWalletAddress}`}
                      className="text-hgtp-blue-600"
                    >
                      {shortenString(metagraph.feesWalletAddress, 4, 4)}
                      <CopyAction value={metagraph.feesWalletAddress} />
                    </Link>
                  ) : (
                    ""
                  ),
                },
              ]}
            />
          </div>
          <div className="border-t border-black/25"></div>
          <div className="grid grid-cols-3 gap-4">
            <NodeLayerInfo
              type="l0"
              layerInfo={nodes.then((nodes) => nodes?.l0)}
            />
            <NodeLayerInfo
              type="cl1"
              layerInfo={nodes.then((nodes) => nodes?.cl1)}
            />
            <NodeLayerInfo
              type="dl1"
              layerInfo={nodes.then((nodes) => nodes?.dl1)}
            />
          </div>
        </div>
        <div className="card flex flex-col w-full">
          <Tabs value={section ?? "transactions"}>
            <Tab id="snapshots" href={`/metagraphs/${metagraphId}`}>
              Snapshots
            </Tab>
            <Tab
              id="transactions"
              href={`/metagraphs/${metagraphId}?section=transactions`}
            >
              Transactions
            </Tab>
          </Tabs>
          {section === "snapshots" && (
            <Table.Suspense
              noCardStyle
              className="w-full [&_td]:text-sm"
              header={<span></span>}
              data={snapshots}
              primaryKey="ordinal"
              titles={{
                ordinal: "Ordinal",
                timestamp: "Timestamp",
                rewards: "Rewards",
                sizeInKB: "Snapshot Size",
                fee: "Snapshot Fee",
              }}
              loadingData={SkeletonSpan.generateTableRecords(5, [
                "ordinal",
                "timestamp",
                "rewards",
                "sizeInKB",
                "fee",
              ])}
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
                      value.reduce((acc, curr) => acc + curr.amount, 0)
                    )}
                  />
                ),
                sizeInKB: (value) => <span>{value}kb</span>,
                fee: (value) => (
                  <FormatCurrency currency="dDAG" value={value ?? 0} />
                ),
              }}
            />
          )}
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
        </div>
      </Section>
    </PageLayout>
  );
}
