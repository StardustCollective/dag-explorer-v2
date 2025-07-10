import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { CopyAction } from "../CopyAction";
import { DetailsTableCard } from "../DetailsTableCard";
import { FormatCurrency } from "../FormatCurrency";
import { FormatCurrencyPrice } from "../FormatCurrencyPrice";
import { MetagraphIcon } from "../MetagraphIcon";
import { Section } from "../Section";
import { Tab, Tabs } from "../Tabs";

import { TransactionsTable } from "./components/TransactionsTable";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import {
  getMetagraph,
} from "@/queries";
import { IBESnapshot } from "@/types";
import { formatNumberWithDecimals, parseNumberOrDefault, shortenString } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";

export type ISnapshotDetailProps = {
  network: HgtpNetwork;
  snapshot: IBESnapshot;
  metagraphId?: string;
  section: string;
  limit?: number;
};

export const SnapshotDetail = async ({
  network,
  metagraphId,
  snapshot,
  section,
  limit = 10,
}: ISnapshotDetailProps) => {
  const metagraph = metagraphId
    ? await getMetagraph(network, metagraphId)
    : null;

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
          snapshot.metagraphSnashotCount !== undefined && {
            label: "Metagraph snapshots",
            value: (
              <span className="flex items-center gap-2">
                {snapshot.metagraphSnashotCount}
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
            <TransactionsTable
              network={network}
              ordinal={snapshot.ordinal}
              metagraphId={metagraphId}
              limit={parseNumberOrDefault(limit, 10)}
            />
          )}
        </div>
      </div>
    </Section>
  );
};
