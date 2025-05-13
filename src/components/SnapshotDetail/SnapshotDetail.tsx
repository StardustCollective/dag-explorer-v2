import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { CopyAction } from "../CopyAction";
import { DetailsTableCard } from "../DetailsTableCard";
import { EmptyState } from "../EmptyState";
import { FormatCurrency } from "../FormatCurrency";
import { FormatCurrencyPrice } from "../FormatCurrencyPrice";
import { MetagraphIcon } from "../MetagraphIcon";
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
import { IBESnapshot, INextTokenPaginationTarget } from "@/types";
import { formatNumberWithDecimals, shortenString } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";

export type ISnapshotDetailProps = {
  network: HgtpNetwork;
  snapshot: IBESnapshot;
  metagraphId?: string;
  section: string;
  tokenPagination?: INextTokenPaginationTarget;
};

export const SnapshotDetail = async ({
  network,
  metagraphId,
  snapshot,
  section,
  tokenPagination = {},
}: ISnapshotDetailProps) => {
  const metagraph = metagraphId
    ? await getMetagraph(network, metagraphId)
    : null;

  const transactions = getTransactionsBySnapshot(
    network,
    snapshot.ordinal,
    metagraphId,
    {
      tokenPagination,
    }
  );

  return (
    <Section title="Overview" className="flex flex-col gap-4">
      {metagraph && (
        <DetailsTableCard
          className="w-full shadow-sm"
          rows={[
            {
              label: "Metagraph name",
              value: (
                <div className="flex items-center gap-2">
                  <MetagraphIcon
                    network={network}
                    metagraphId={metagraph.id}
                    size={5}
                  />
                  <Link
                    className="text-hgtp-blue-600"
                    href={`/metagraphs/${metagraph.id}`}
                  >
                    {metagraph.name}
                  </Link>
                </div>
              ),
            },
            {
              label: "Metagraph ID",
              value: (
                <span className="flex items-center gap-1">
                  <Link
                    className="text-hgtp-blue-600"
                    href={`/metagraphs/${metagraph.id}`}
                  >
                    <span className="lg:block hidden">
                      {shortenString(metagraph.id, 8, 8)}
                    </span>
                    <span className="lg:hidden block">
                      {shortenString(metagraph.id, 6, 6)}
                    </span>
                  </Link>
                  <CopyAction value={metagraph.id} />
                </span>
              ),
            },
          ]}
        />
      )}
      <DetailsTableCard
        className="w-full shadow-sm"
        rows={[
          {
            label: "Timestamp",
            value: (
              <span className="flex items-center gap-2">
                <CalendarClock4Icon className="size-5 shrink-0" />
                {dayjs(snapshot.timestamp).fromNow()}
                <span className="text-gray-500 lg:block hidden">
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
              <span className="flex items-center gap-1">
                {snapshot.ordinal} <CopyAction value={snapshot.ordinal} />
              </span>
            ),
          },
          snapshot.epochProgress !== undefined && {
            label: "Epoch Progress",
            value: (
              <span className="flex items-center gap-2">
                {formatNumberWithDecimals(snapshot.epochProgress, {
                  maxD: 0,
                })}
              </span>
            ),
          },
          {
            label: "Snapshot Hash",
            value: (
              <span className="flex items-center gap-1">
                <span className="lg:block hidden">{snapshot.hash}</span>
                <span className="lg:hidden block">
                  {shortenString(snapshot.hash, 4, 4)}
                </span>
                <CopyAction value={snapshot.hash} />
              </span>
            ),
          },
          {
            label: "Last Snapshot Hash",
            value: (
              <span className="flex items-center gap-1">
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
                  <span className="lg:block hidden">
                    {snapshot.lastSnapshotHash}
                  </span>
                  <span className="lg:hidden block">
                    {shortenString(snapshot.lastSnapshotHash, 4, 4)}
                  </span>
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
          snapshot.sizeInKb !== undefined && {
            label: "Snapshot Size",
            value: (
              <span className="flex items-center gap-2">
                {snapshot.sizeInKb}KB
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
                <CheckCircleOutlineIcon className="size-5 shrink-0" /> Confirmed
              </span>
            ),
          },
        ]}
      />
      <div className="card shadow-sm flex flex-col w-full">
        <Tabs value={section}>
          <Tab
            id="transactions"
            renderAs={Link}
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
        <div className="flex lg:p-0 px-4 pt-4">
          {section === "transactions" && (
            <Table.Suspense
              noCardStyle
              className="w-full [&_td]:text-sm"
              header={<span></span>}
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
        </div>
      </div>
    </Section>
  );
};
