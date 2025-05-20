import clsx from "clsx";
import dayjs from "dayjs";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getNetworkFromParamsOrFail } from "@/common/network";
import { CopyAction } from "@/components/CopyAction";
import { DetailsTableCard } from "@/components/DetailsTableCard";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { getSignature } from "@/queries/actions/signatures";
import { shortenString } from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import CheckCircleOutlineIcon from "@/assets/icons/circle-check-outline.svg";

export const revalidate = 86_400; // 24 hours - These should not change, almost immutable

type ITransactionPageProps = {
  params: Promise<{ network: string; signatureHash: string }>;
};

export async function generateMetadata({
  params,
}: ITransactionPageProps): Promise<Metadata> {
  const { signatureHash } = await params;

  return {
    title: `Signature ${shortenString(signatureHash)} - DAG Explorer`,
    description: `Signature Details ${signatureHash} - DAG Explorer`,
  };
}

export default async function TransactionPage({
  params,
}: ITransactionPageProps) {
  const { signatureHash } = await params;
  const network = await getNetworkFromParamsOrFail(params);

  const signature = await getSignature(network, signatureHash);

  if (!signature) {
    throw notFound();
  }

  return (
    <>
      <PageTitle>Signature details</PageTitle>
      <PageLayout
        className="flex flex-col gap-4 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <Section className="flex flex-col gap-4">
          <DetailsTableCard
            className="w-full shadow-sm"
            rows={[
              {
                label: "Timestamp",
                value: (
                  <span className="flex flex-col lg:flex-row items-center gap-2">
                    <span className="flex items-center gap-2">
                      <CalendarClock4Icon className="size-5 shrink-0" />
                      {dayjs(signature.timestamp).fromNow()}
                    </span>
                    <span className="text-gray-500 lg:block hidden">
                      (
                      {dayjs(signature.timestamp).format(
                        "YYYY-MM-DD hh:mm:ss A +UTC"
                      )}
                      )
                    </span>
                  </span>
                ),
              },
              {
                label: "Signature Hash",
                value: (
                  <span className="flex items-center gap-1">
                    <span className="lg:block hidden">
                      {shortenString(signature.hash, 8, 8)}
                    </span>
                    <span className="lg:hidden block">
                      {shortenString(signature.hash, 6, 6)}
                    </span>
                    <CopyAction value={signature.hash} />
                  </span>
                ),
              },
              {
                label: "Signature Payload",
                value: (
                  <span className="flex items-center gap-1">
                    <span className="lg:block hidden">
                      {shortenString(signature.signature, 8, 8)}
                    </span>
                    <span className="lg:hidden block">
                      {shortenString(signature.signature, 6, 6)}
                    </span>
                    <CopyAction value={signature.signature} />
                  </span>
                ),
              },
              {
                label: "Message",
                value: (
                  <span className="flex items-center gap-1">
                    <span className="lg:block hidden">
                      {signature.message}
                    </span>
                    <span className="lg:hidden block">
                      {signature.message}
                    </span>
                    <CopyAction value={signature.message} />
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
                    <CheckCircleOutlineIcon className="size-5 shrink-0" />{" "}
                    Verified
                  </span>
                ),
              },
            ]}
          />
          <DetailsTableCard
            className="w-full shadow-sm"
            rows={[
              {
                label: "Signer",
                value: (
                  <span className="flex items-center gap-1">
                    <Link
                      className="flex items-center gap-2 text-hgtp-blue-600"
                      href={`/address/${signature.address}`}
                    >
                      <span className="lg:block hidden">
                        {shortenString(signature.address, 8, 8)}
                      </span>
                      <span className="lg:hidden block">
                        {shortenString(signature.address, 6, 6)}
                      </span>
                    </Link>
                    <CopyAction value={signature.address} />
                  </span>
                ),
              },
              {
                label: "Signer Public Key",
                value: (
                  <span className="flex items-center gap-1">
                    <Link
                      className="flex items-center gap-2 text-hgtp-blue-600"
                      href={`/address/${signature.address}`}
                    >
                      <span className="lg:block hidden">
                        {shortenString(signature.pubKey, 8, 8)}
                      </span>
                      <span className="lg:hidden block">
                        {shortenString(signature.pubKey, 6, 6)}
                      </span>
                    </Link>
                    <CopyAction value={signature.pubKey} />
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
