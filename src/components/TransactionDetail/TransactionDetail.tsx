import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { CopyAction } from "../CopyAction";
import { DetailsTableCard } from "../DetailsTableCard";
import { FormatCurrency } from "../FormatCurrency";
import { Section } from "../Section";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag, getKnownUsdPrice } from "@/common/currencies";
import { getMetagraph, getMetagraphCurrencySymbol } from "@/queries";
import { IBETransaction } from "@/types";
import { formatCurrencyWithDecimals, shortenString } from "@/utils";

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

  const price = await getKnownUsdPrice(network, metagraphId);

  return (
    <Section className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="card flex flex-col gap-4 p-6">
          <span className="text-black/65 font-semibold">Transaction Type</span>
          <span className="text-hgtp-blue-900 font-medium text-xl">
            CurrencyTransaction
          </span>
        </div>
        <div className="card flex flex-col gap-4 p-6">
          <span className="text-black/65 font-semibold">Metagraph</span>
          <span className="text-hgtp-blue-600 font-medium text-xl">
            {metagraphId
              ? metagraph?.metagraphName ?? shortenString(metagraphId, 6, 6)
              : "Constellation"}
          </span>
        </div>
      </div>
      <DetailsTableCard
        className="w-full"
        rows={[
          {
            label: "Timestamp",
            value: (
              <span className="flex items-center gap-2">
                <CalendarClock4Icon className="size-5" />
                {dayjs(transaction.timestamp).fromNow()}
                <span className="text-gray-500">
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
                href={`/snapshots/${transaction.snapshotOrdinal}`}
              >
                {transaction.snapshotOrdinal}
              </Link>
            ),
          },
          {
            label: "Txn Hash",
            value: (
              <span className="flex items-center gap-2">
                {shortenString(transaction.hash, 8, 8)}
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
                <CheckCircleOutlineIcon className="size-5" /> Success
              </span>
            ),
          },
        ]}
      />

      <DetailsTableCard
        className="w-full"
        rows={[
          {
            label: "Source",
            value: (
              <Link
                className="flex items-center gap-2 text-hgtp-blue-600"
                href={`/address/${transaction.source}`}
              >
                {shortenString(transaction.source, 8, 8)}
                <CopyAction value={transaction.source} />
              </Link>
            ),
          },
          {
            label: "Destination",
            value: (
              <Link
                className="flex items-center gap-2 text-hgtp-blue-600"
                href={`/address/${transaction.destination}`}
              >
                {shortenString(transaction.destination, 8, 8)}
                <CopyAction value={transaction.destination} />
              </Link>
            ),
          },
        ]}
      />
      <DetailsTableCard
        className="w-full"
        rows={[
          {
            label: "Amount",
            value: (
              <span className="flex gap-2">
                <FormatCurrency
                  value={datumToDag(transaction.amount)}
                  currency={getMetagraphCurrencySymbol(network, metagraphId)}
                />

                {price && (
                  <span className="text-gray-500">
                    ($
                    {formatCurrencyWithDecimals(
                      "USD",
                      (price * transaction.amount) / 1e8
                    )}
                    )
                  </span>
                )}
              </span>
            ),
          },
          {
            label: "Fee",
            value: (
              <span className="flex gap-2">
                <FormatCurrency
                  value={datumToDag(transaction.fee)}
                  currency={getMetagraphCurrencySymbol(network, metagraphId)}
                />
                {price && (
                  <span className="text-gray-500">
                    ($
                    {formatCurrencyWithDecimals(
                      "USD",
                      (price * transaction.fee) / 1e8
                    )}
                    )
                  </span>
                )}
              </span>
            ),
          },
        ]}
      />
    </Section>
  );
};
