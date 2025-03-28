import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { CopyAction } from "../CopyAction";
import { DetailsTableCard } from "../DetailsTableCard";
import { FormatCurrency } from "../FormatCurrency";
import { FormatCurrencyPrice } from "../FormatCurrencyPrice";
import { Section } from "../Section";
import { SkeletonSpan } from "../SkeletonSpan";
import { Table } from "../Table";
import { Tab, Tabs } from "../Tabs";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import {
  getMetagraph,
  getMetagraphCurrencySymbol,
  getTransactionsBySnapshot,
} from "@/queries";
import { IBESnapshot } from "@/types";
import { shortenString } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";

export type ISnapshotDetailProps = {
  network: HgtpNetwork;
  snapshot: IBESnapshot;
  metagraphId?: string;
  section: string;
};

export const SnapshotDetail = async ({
  network,
  metagraphId,
  snapshot,
  section,
}: ISnapshotDetailProps) => {
  const metagraph = metagraphId
    ? await getMetagraph(network, metagraphId)
    : null;

  const transactions = getTransactionsBySnapshot(
    network,
    snapshot.ordinal,
    metagraphId
  );

  return (
    <Section title="Overview" className="flex flex-col gap-4">
      {metagraph && (
        <DetailsTableCard
          className="w-full"
          rows={[
            {
              label: "Metagraph name",
              value: (
                <Link
                  className="text-hgtp-blue-600"
                  href={`/metagraphs/${metagraph.metagraphId}`}
                >
                  {metagraph.metagraphName}
                </Link>
              ),
            },
            {
              label: "Metagraph ID",
              value: (
                <span className="flex items-center gap-2">
                  <Link
                    className="text-hgtp-blue-600"
                    href={`/metagraphs/${metagraph.metagraphId}`}
                  >
                    {shortenString(metagraph.metagraphId, 8, 8)}
                  </Link>
                  <CopyAction value={metagraph.metagraphId} />
                </span>
              ),
            },
          ]}
        />
      )}
      <DetailsTableCard
        className="w-full"
        rows={[
          {
            label: "Timestamp",
            value: (
              <span className="flex items-center gap-2">
                <CalendarClock4Icon className="size-5" />
                {dayjs(snapshot.timestamp).fromNow()}
                <span className="text-gray-500">
                  (
                  {dayjs(snapshot.timestamp).format(
                    "YYYY-MM-DD hh:mm:ss A +UTC"
                  )}
                  )
                </span>
              </span>
            ),
          },
          {
            label: "Ordinal",
            value: (
              <span className="flex items-center gap-2">
                {snapshot.ordinal} <CopyAction value={snapshot.ordinal} />
              </span>
            ),
          },
          {
            label: "Snapshot Hash",
            value: (
              <span className="flex items-center gap-2">
                {snapshot.hash}
                <CopyAction value={snapshot.hash} />
              </span>
            ),
          },
          {
            label: "Last Snapshot Hash",
            value: (
              <span className="flex items-center gap-2">
                <Link
                  className="text-hgtp-blue-600"
                  href={
                    metagraphId
                      ? `/metagraphs/${metagraphId}/snapshots/${
                          snapshot.ordinal - 1
                        }`
                      : `/snapshots/${snapshot.ordinal - 1}`
                  }
                >
                  {snapshot.lastSnapshotHash}
                </Link>
                <CopyAction value={snapshot.lastSnapshotHash} />
              </span>
            ),
          },
          snapshot.fee !== undefined && {
            label: "Snapshot Fee",
            value: (
              <span className="flex items-center gap-2">
                <FormatCurrency
                  value={datumToDag(snapshot.fee)}
                  currency="DAG"
                />
                <FormatCurrencyPrice
                  className="text-gray-900/65"
                  network={network}
                  value={datumToDag(snapshot.fee)}
                />
              </span>
            ),
          },
          snapshot.sizeInKB !== undefined && {
            label: "Snapshot Size",
            value: (
              <span className="flex items-center gap-2">
                {snapshot.sizeInKB}KB
              </span>
            ),
          },
          {
            label: "Status",
            value: (
              <span
                className={clsx(
                  "flex items-center gap-1 py-1.5 px-3 w-fit",
                  "text-sm font-medium text-green-800",
                  "bg-green-50 border border-green-400 rounded-4xl"
                )}
              >
                <CheckCircleOutlineIcon className="size-5" /> Confirmed
              </span>
            ),
          },
        ]}
      />
      <div className="card flex flex-col w-full">
        <Tabs value={section}>
          <Tab
            id="transactions"
            href={
              metagraphId
                ? `/metagraphs/${metagraphId}/snapshots/${snapshot.ordinal}`
                : `/snapshots/${snapshot.ordinal}`
            }
          >
            Transactions
          </Tab>
          {/* <Tab
            id="rewards"
            href={
              metagraphId
                ? `/metagraphs/${metagraphId}/snapshots/${snapshot.ordinal}?section=rewards`
                : `/snapshots/${snapshot.ordinal}?section=rewards`
            }
          >
            Rewards
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
                <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
                  {shortenString(value)} <CopyAction value={value} />
                </Link>
              ),
              destination: (value) => (
                <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
                  {shortenString(value)} <CopyAction value={value} />
                </Link>
              ),
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
                    value={datumToDag(value)}
                    currencyId={record.metagraphId}
                  />
                </span>
              ),
            }}
          />
        )}
        {/* {section === "rewards" && (
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
                <Link className="text-hgtp-blue-600" href={`/address/${value}`}>
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
        )} */}
      </div>
    </Section>
  );
};
