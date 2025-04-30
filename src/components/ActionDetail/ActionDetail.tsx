import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { CopyAction } from "../CopyAction";
import { DetailsTableCard } from "../DetailsTableCard";
import { FormatCurrency } from "../FormatCurrency";
import { FormatCurrencyPrice } from "../FormatCurrencyPrice";
import { MetagraphIcon } from "../MetagraphIcon";
import { Section } from "../Section";

import { HgtpNetwork, NetworkEpochInSeconds } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { getCurrentEpochProgress, getMetagraph } from "@/queries";
import { IAPIActionTransaction } from "@/types";
import { shortenString } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";
import HourglassIcon from "@/assets/icons/hourglass.svg";

export type IActionDetailProps = {
  network: HgtpNetwork;
  action: IAPIActionTransaction;
  metagraphId?: string;
};

export const ActionDetail = async ({
  network,
  metagraphId,
  action,
}: IActionDetailProps) => {
  const metagraph = metagraphId
    ? await getMetagraph(network, metagraphId)
    : null;

  const epochProgress = await getCurrentEpochProgress(network);

  return (
    <Section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card flex flex-col gap-4 p-6">
          <span className="text-black/65 font-semibold">Transaction Type</span>
          <span className="text-hgtp-blue-900 font-medium text-xl">
            {action.type}
          </span>
        </div>
        <div className="card flex flex-col gap-4 p-6">
          <span className="text-black/65 font-semibold">Metagraph</span>
          <span
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
          </span>
        </div>
      </div>
      <DetailsTableCard
        className="w-full"
        rows={[
          {
            label: "Timestamp",
            value: (
              <span className="flex flex-col lg:flex-row items-center gap-2">
                <span className="flex items-center gap-2">
                  <CalendarClock4Icon className="size-5 shrink-0" />
                  {dayjs(action.timestamp).fromNow()}
                </span>
                <span className="text-gray-500 lg:block hidden">
                  (
                  {dayjs(action.timestamp).format("YYYY-MM-DD hh:mm:ss A +UTC")}
                  )
                </span>
              </span>
            ),
          },
          typeof action.ordinal === "number" && {
            label: "Snapshot",
            value: (
              <Link
                className="text-hgtp-blue-600"
                href={
                  metagraphId
                    ? `/metagraphs/${metagraphId}/snapshots/${action.ordinal}`
                    : `/snapshots/${action.ordinal}`
                }
              >
                {action.ordinal}
              </Link>
            ),
          },
          {
            label: "Txn Hash",
            value: (
              <span className="flex items-center gap-1">
                <span className="lg:block hidden">
                  {shortenString(action.hash, 8, 8)}
                </span>
                <span className="lg:hidden block">
                  {shortenString(action.hash, 6, 6)}
                </span>
                <CopyAction value={action.hash} />
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
        className="w-full"
        rows={[
          {
            label: "Amount",
            value: (
              <span className="flex gap-2">
                <FormatCurrency
                  value={datumToDag(action.amount)}
                  currency={metagraph?.symbol ?? "DAG"}
                />
                <FormatCurrencyPrice
                  className="text-gray-500"
                  network={network}
                  currencyId={metagraphId}
                  value={datumToDag(action.amount)}
                />
              </span>
            ),
          },
          typeof action.unlockEpoch === "number" && {
            label: "Unlock Epoch",
            value: (
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <HourglassIcon className="size-4 shrink-0 text-black/60" />
                  {action.unlockEpoch}
                </span>
                {typeof epochProgress === "number" && (
                  <span className="flex items-center gap-1 text-black/60">
                    <CalendarClock4Icon className="size-4 shrink-0 text-black/60" />
                    ~
                    {dayjs()
                      .add(
                        (action.unlockEpoch - epochProgress) /
                          NetworkEpochInSeconds,
                        "seconds"
                      )
                      .format("MMM.DD YYYY")}{" "}
                    +UTC
                  </span>
                )}
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
              <span className="flex items-center gap-1">
                <Link
                  className="flex items-center gap-2 text-hgtp-blue-600"
                  href={`/address/${action.source}`}
                >
                  <span className="lg:block hidden">
                    {shortenString(action.source, 8, 8)}
                  </span>
                  <span className="lg:hidden block">
                    {shortenString(action.source, 6, 6)}
                  </span>
                </Link>
                <CopyAction value={action.source} />
              </span>
            ),
          },
          !!action.destination && {
            label: "Destination",
            value: (
              <span className="flex items-center gap-1">
                <Link
                  className="flex items-center gap-2 text-hgtp-blue-600"
                  href={`/address/${action.destination}`}
                >
                  <span className="lg:block hidden">
                    {shortenString(action.destination, 8, 8)}
                  </span>
                  <span className="lg:hidden block">
                    {shortenString(action.destination, 6, 6)}
                  </span>
                </Link>
                <CopyAction value={action.destination} />
              </span>
            ),
          },
        ]}
      />
    </Section>
  );
};
