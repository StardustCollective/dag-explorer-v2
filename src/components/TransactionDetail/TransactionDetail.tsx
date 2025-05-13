import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { CopyAction } from "../CopyAction";
import { DetailsTableCard } from "../DetailsTableCard";
import { FormatCurrency } from "../FormatCurrency";
import { FormatCurrencyPrice } from "../FormatCurrencyPrice";
import { MetagraphIcon } from "../MetagraphIcon";
import { Section } from "../Section";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { getMetagraph } from "@/queries";
import { IBETransaction } from "@/types";
import { shortenString } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";

export type ITransactionDetailProps = {
  network: HgtpNetwork;
  transaction: IBETransaction;
  metagraphId?: string;
};

export const TransactionDetail = async ({
  network,
  metagraphId,
  transaction,
}: ITransactionDetailProps) => {
  const metagraph = metagraphId
    ? await getMetagraph(network, metagraphId)
    : null;

  return (
    <Section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card shadow-sm flex flex-col gap-4 p-6">
          <span className="text-black/65 font-semibold">Transaction Type</span>
          <span className="text-hgtp-blue-900 font-medium text-xl">
            CurrencyTransaction
          </span>
        </div>
        <div className="card shadow-sm flex flex-col gap-4 p-6">
          <span className="text-black/65 font-semibold">Metagraph</span>
          <Link
            href={metagraphId ? `/metagraphs/${metagraphId}` : ``}
            className={clsx(
              "flex items-center gap-2",
              "text-hgtp-blue-600 font-medium text-xl"
            )}
          >
            <MetagraphIcon
              network={network}
              metagraphId={metagraphId}
              size={6}
            />
            {metagraphId
              ? metagraph?.name ?? shortenString(metagraphId, 6, 6)
              : "Constellation"}
          </Link>
        </div>
      </div>
      <DetailsTableCard
        className="w-full shadow-sm"
        rows={[
          {
            label: "Timestamp",
            value: (
              <span className="flex flex-col lg:flex-row items-center gap-2">
                <span className="flex items-center gap-2">
                  <CalendarClock4Icon className="size-5 shrink-0" />
                  {dayjs(transaction.timestamp).fromNow()}
                </span>
                <span className="text-gray-500 lg:block hidden">
                  (
                  {dayjs(transaction.timestamp).format(
                    "YYYY-MM-DD hh:mm:ss A +UTC"
                  )}
                  )
                </span>
              </span>
            ),
          },
          {
            label: "Snapshot",
            value: (
              <Link
                className="text-hgtp-blue-600"
                href={
                  metagraphId
                    ? `/metagraphs/${metagraphId}/snapshots/${transaction.snapshotOrdinal}`
                    : `/snapshots/${transaction.snapshotOrdinal}`
                }
              >
                {transaction.snapshotOrdinal}
              </Link>
            ),
          },
          {
            label: "Txn Hash",
            value: (
              <span className="flex items-center gap-1">
                <span className="lg:block hidden">
                  {shortenString(transaction.hash, 8, 8)}
                </span>
                <span className="lg:hidden block">
                  {shortenString(transaction.hash, 6, 6)}
                </span>
                <CopyAction value={transaction.hash} />
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
      <DetailsTableCard
        className="w-full shadow-sm"
        rows={[
          {
            label: "Source",
            value: (
              <span className="flex items-center gap-1">
                <Link
                  className="flex items-center gap-2 text-hgtp-blue-600"
                  href={`/address/${transaction.source}`}
                >
                  <span className="lg:block hidden">
                    {shortenString(transaction.source, 8, 8)}
                  </span>
                  <span className="lg:hidden block">
                    {shortenString(transaction.source, 6, 6)}
                  </span>
                </Link>
                <CopyAction value={transaction.source} />
              </span>
            ),
          },
          {
            label: "Destination",
            value: (
              <span className="flex items-center gap-1">
                <Link
                  className="flex items-center gap-2 text-hgtp-blue-600"
                  href={`/address/${transaction.destination}`}
                >
                  <span className="lg:block hidden">
                    {shortenString(transaction.destination, 8, 8)}
                  </span>
                  <span className="lg:hidden block">
                    {shortenString(transaction.destination, 6, 6)}
                  </span>
                </Link>
                <CopyAction value={transaction.destination} />
              </span>
            ),
          },
        ]}
      />
      <DetailsTableCard
        className="w-full shadow-sm"
        rows={[
          {
            label: "Amount",
            value: (
              <span className="flex gap-2">
                <FormatCurrency
                  value={datumToDag(transaction.amount)}
                  currency={metagraph?.symbol ?? "DAG"}
                />
                <FormatCurrencyPrice
                  className="text-gray-500"
                  network={network}
                  currencyId={metagraphId}
                  value={datumToDag(transaction.amount)}
                />
              </span>
            ),
          },
          {
            label: "Fee",
            value: (
              <span className="flex gap-2">
                <FormatCurrency
                  value={datumToDag(transaction.fee)}
                  currency={metagraph?.symbol ?? "DAG"}
                />
                <FormatCurrencyPrice
                  className="text-gray-500"
                  network={network}
                  currencyId={metagraphId}
                  value={datumToDag(transaction.fee)}
                />
              </span>
            ),
          },
        ]}
      />
    </Section>
  );
};
