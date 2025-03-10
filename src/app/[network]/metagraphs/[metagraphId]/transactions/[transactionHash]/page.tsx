import { getNetworkFromParams } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { Section } from "@/components/Section";
import { getMetagraph, getMetagraphTransaction, getTransaction } from "@/queries";
import { formatCurrencyWithDecimals, shortenString } from "@/utils";
import Link from "next/link";

import { PageTitle } from "@/components/PageTitle";
import { notFound } from "next/navigation";
import { DetailsCard } from "@/components/DetailsCard";
import { CopyAction } from "@/components/CopyAction";
import dayjs from "dayjs";
import CalendarClock4Icon from "@/assets/icons/calendar_clock_4.svg";
import { getKnownUsdPrice } from "@/common/prices";

export const revalidate = 86_400; // 24 hours - These should not change, almost immutable

export default async function MetagrapgTransactionPage({
  params,
}: {
  params: Promise<{
    network: string;
    metagraphId: string;
    transactionHash: string;
  }>;
}) {
  const { transactionHash, metagraphId } = await params;
  const network = await getNetworkFromParams(params);

  if (!network) {
    throw new Error("Network not found");
  }

  const transaction = await getMetagraphTransaction(
    network,
    metagraphId,
    transactionHash
  );

  if (!transaction) {
    throw notFound();
  }

  const metagraph = await getMetagraph(network, metagraphId);

  const price = await getKnownUsdPrice(network, metagraphId);

  return (
    <>
      <PageTitle>Transaction details</PageTitle>
      <PageLayout className="flex flex-col gap-4 px-20 py-8" renderAs={"main"}>
        <Section className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card flex flex-col gap-4 p-6">
              <span className="text-black/65 font-semibold">
                Transaction Type
              </span>
              <span className="text-hgtp-blue-900 font-medium text-xl">
                CurrencyTransaction
              </span>
            </div>
            <div className="card flex flex-col gap-4 p-6">
              <span className="text-black/65 font-semibold">Metagraph</span>
              <span className="text-hgtp-blue-600 font-medium text-xl">
                {metagraph?.metagraphName ?? shortenString(metagraphId, 6, 6)}
              </span>
            </div>
          </div>
          <DetailsCard
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
                value: "Success",
              },
            ]}
          />
          <DetailsCard
            className="w-full"
            rows={[
              {
                label: "Amount",
                value: (
                  <span className="flex gap-2">
                    {formatCurrencyWithDecimals(
                      metagraph?.metagraphSymbol ?? "--",
                      transaction.amount / 1e8
                    )}
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
                    {formatCurrencyWithDecimals("DAG", transaction.fee / 1e8)}
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
      </PageLayout>
    </>
  );
}
