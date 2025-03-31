import { dag4 } from "@stardust-collective/dag4";
import clsx from "clsx";
import dayjs from "dayjs";
import { notFound } from "next/navigation";

import { StakingActionsProvider } from "./components/StakingActionsProvider";

import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { StatCard } from "@/components/StatCard";
import { Table } from "@/components/Table";
import { getAddressStakingDelegations } from "@/queries";
import { parseNumberOrDefault, shortenString } from "@/utils";

import DotGrid1x3HorizontalIcon from "@/assets/icons/dot-grid-1x3-horizontal.svg";
import LockedIcon from "@/assets/icons/locked.svg";
import Server1Icon from "@/assets/icons/server-1.svg";
import UnlockedIcon from "@/assets/icons/unlocked.svg";

export const revalidate = 30;

export default async function AddressStakingPage({
  params,
}: {
  params: Promise<{ network: string; addressId: string }>;
}) {
  const { addressId } = await params;

  const network = await getNetworkFromParamsOrFail(params);

  if (!dag4.keyStore.validateDagAddress(addressId)) {
    throw notFound();
  }

  const delegations = await getAddressStakingDelegations(network, addressId);

  return (
    <StakingActionsProvider>
      <PageTitle icon={<Server1Icon className="size-8" />}>
        My Delegations
      </PageTitle>
      <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
        <Section title="Delegation stats" className="flex flex-nowrap gap-6">
          <StatCard label="Total DAG delegated">
            <FormatCurrency
              value={datumToDag(
                delegations.reduce((pv, cv) => pv + cv.amount, 0)
              )}
              currency="DAG"
            />
          </StatCard>
          <StatCard label="Total Active Delegations">
            {delegations.filter((d) => d.withdrawalStartEpoch === null).length}
          </StatCard>
          <StatCard label="Total DAG Unlocking">
            {delegations.filter((d) => d.withdrawalStartEpoch !== null).length}
          </StatCard>
        </Section>
        <Section title="Delegated positions" className="flex flex-nowrap gap-6">
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            data={delegations}
            primaryKey="hash"
            titles={{
              nodeId: "Validator",
              amount: "Total Delegated",
              fee: "Validator Commission",
              tokenLockRef: "Estimated APR",
              hash: "Delegate Start Date",
              withdrawalStartEpoch: "Status",
              withdrawalEndEpoch: "Actions",
            }}
            colWidths={{ withdrawalEndEpoch: 0.5 }}
            colClassNames={{
              withdrawalEndEpoch: "w-full items-center justify-center",
            }}
            loadingData={SkeletonSpan.generateTableRecords(3, [
              "nodeId",
              "amount",
              "fee",
              "tokenLockRef",
              "hash",
              "withdrawalStartEpoch",
              "withdrawalEndEpoch",
            ])}
            format={{
              nodeId: (value) =>
                shortenString(dag4.keyStore.getDagAddressFromPublicKey(value)),
              amount: (value) => (
                <FormatCurrency value={datumToDag(value)} currency="DAG" />
              ),
              fee: () => <span>10%</span>,
              tokenLockRef: () => <span>~12.5%</span>,
              hash: (_, record) => (
                <span>
                  {dayjs()
                    .add(
                      (parseNumberOrDefault(datumToDag(record.amount), 1) %
                        366) *
                        -1,
                      "days"
                    )
                    .format("MM/DD/YYYY")}
                </span>
              ),
              withdrawalStartEpoch: (value) =>
                value === null ? (
                  <span
                    className={clsx(
                      "flex gap-1 items-center justify-center",
                      "text-black font-medium text-xs",
                      "bg-gray-200",
                      "rounded-3xl",
                      "h-6 px-3"
                    )}
                  >
                    <LockedIcon className="size-3.5" /> Locked
                  </span>
                ) : (
                  <span
                    className={clsx(
                      "flex gap-1 items-center justify-center",
                      "text-ltx-gold-950 font-medium text-xs",
                      "bg-ltx-gold-300",
                      "rounded-3xl",
                      "h-6 px-3"
                    )}
                  >
                    <UnlockedIcon className="size-3.5" /> Unlocking
                  </span>
                ),
              withdrawalEndEpoch: (value, record) => (
                <span
                  className={clsx(
                    "flex items-center justify-center",
                    "size-8",
                    "rounded-full border border-gray-300",
                    "hover:border-hgtp-blue-600 hover:bg-hgtp-blue-50"
                  )}
                >
                  <DotGrid1x3HorizontalIcon className="size-4 text-hgtp-blue-600" />
                </span>
              ),
            }}
          />
        </Section>
      </PageLayout>
    </StakingActionsProvider>
  );
}
