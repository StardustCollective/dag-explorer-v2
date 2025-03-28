import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { HgtpNetwork } from "@/common/consts/network";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { Table } from "@/components/Table";
import {
  getMetagraphs,
} from "@/queries";
import {
  formatCurrencyWithDecimals,
  formatNumberWithDecimals,
  stringFormat,
} from "@/utils";

import Brain2Icon from "@/assets/icons/brain-2.svg";
import ConstellationCircleGrayIcon from "@/assets/logos/constellation-circle-gray.svg";


export const revalidate = 15;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function MetagraphsPage({
  params,
}: {
  params: Promise<{ network: string }>;
}) {
  const network = await getNetworkFromParamsOrFail(params);

  const metagraphs = getMetagraphs(network, { pagination: { limit: 10 } });

  return (
    <>
    <PageTitle icon={<Brain2Icon className="size-8" />}>
        Metagraphs
      </PageTitle>
      <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
        <Section title="Top projects">
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={metagraphs.then((data) =>
              data.sort((a, b) => a.type.localeCompare(b.type))
            )}
            primaryKey="id"
            titles={{
              name: "Projects",
              type: "Type",
              snapshots90d: "Snapshots (90D)",
              fees90d: "Fees (90D)",
              feesTotal: "Total Fees",
            }}
            loadingData={SkeletonSpan.generateTableRecords(5, [
              "name",
              "type",
              "snapshots90d",
              "fees90d",
              "feesTotal",
            ])}
            format={{
              name: (value, record) => (
                <Link
                  className="flex flex-row gap-3 items-center text-hgtp-blue-600 font-medium"
                  href={
                    record.metagraphId !== null
                      ? `/metagraphs/${record.metagraphId}`
                      : "#"
                  }
                >
                  <div className="size-8 rounded-full">
                    {record.icon_url && (
                      <Image
                        className="object-contain size-8"
                        src={record.icon_url}
                        alt={value}
                        width={32}
                        height={32}
                      />
                    )}
                    {!record.icon_url && (
                      <ConstellationCircleGrayIcon className="size-8" />
                    )}
                  </div>
                  {value}
                </Link>
              ),
              type: (value) => (
                <span
                  className={clsx(
                    "flex items-center px-3 py-1 rounded-3xl w-fit text-xs font-medium",
                    value === "public" && "bg-hgtp-blue-50",
                    value === "private" && "bg-gray-100"
                  )}
                >
                  {stringFormat(value, "TITLE_CASE")}
                </span>
              ),
              snapshots90d: (value) => (
                <span>
                  {value === null ? "Hidden" : formatNumberWithDecimals(value)}
                </span>
              ),
              fees90d: (value) => (
                <span>
                  {value === null
                    ? "Hidden"
                    : formatCurrencyWithDecimals("DAG", (value ?? 0) / 1e8)}
                </span>
              ),
              feesTotal: (value) => (
                <span>
                  {value === null
                    ? "Hidden"
                    : formatCurrencyWithDecimals("DAG", (value ?? 0) / 1e8)}
                </span>
              ),
            }}
          />
        </Section>
      </PageLayout>
    </>
  );
}
