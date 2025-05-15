"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";

import { DelegatedPositionActions } from "./DelegatedPositionActions";

import { NetworkEpochInSeconds } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { SuspenseValue } from "@/components/SuspenseValue";
import { Table } from "@/components/Table";
import { InfoTooltip, Tooltip } from "@/components/Tooltip";
import { ValidatorIcon } from "@/components/ValidatorIcon";
import { useDelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";
import { IAddressDelegation } from "@/features/delegated-stake/utils/address";
import {
  decodeDecimal,
  formatNumberWithDecimals,
  shortenString,
} from "@/utils";

import CalendarClock4Icon from "@/assets/icons/calendar-clock-4.svg";
import Coin1Icon from "@/assets/icons/coin-1.svg";
import HourglassIcon from "@/assets/icons/hourglass.svg";

export const DelegationsTable = () => {
  const { epochProgress, userDelegationsQuery, userDelegations } =
    useDelegatedStakeProvider();

  const getAPRForDelegation = (delegation: IAddressDelegation) => {
    if (!delegation.snapshot) {
      return "--";
    }

    const rewardPerStakeRt = delegation.rewardAmount / delegation.amount;
    const rewardPerStakePerSecRt =
      rewardPerStakeRt /
      dayjs().diff(dayjs(delegation.snapshot.timestamp), "seconds");

    const apr = rewardPerStakePerSecRt * (365 * 24 * 60 * 60) * 100;

    return Math.floor(apr);
  };

  return (
    <Section title="Delegated positions" className="flex flex-nowrap gap-6">
      <Table.Suspense
        className="w-full [&_td]:text-sm"
        data={userDelegations ?? []}
        primaryKey="hash"
        titles={{
          nodeId: "Validator",
          amount: "Total Delegated",
          validator: "Commission",
          fee: "Est. APR",
          snapshot: "Delegate Start Date",
          withdrawalStartEpoch: "Status",
          rewardAmount: (
            <span className="flex items-center gap-2">
              Rewards
              <InfoTooltip
                content="Rewards are auto-compounded, so the more you earn, the faster your position grows"
                place="bottom"
              />
            </span>
          ),
          withdrawalEndEpoch: "Actions",
        }}
        colWidths={{ withdrawalEndEpoch: 0.5 }}
        colClassNames={{
          withdrawalEndEpoch: "w-full items-center justify-center",
        }}
        loading={userDelegationsQuery.isLoading}
        loadingData={SkeletonSpan.generateTableRecords(3, [
          "nodeId",
          "amount",
          "validator",
          "fee",
          "snapshot",
          "withdrawalStartEpoch",
          "rewardAmount",
          "withdrawalEndEpoch",
        ])}
        emptyState={
          <EmptyState
            renderIcon={Coin1Icon}
            label="You have no active delegated positions"
          />
        }
        format={{
          nodeId: (value, record) => (
            <Tooltip
              renderAs="span"
              className="flex gap-4 items-center"
              content={shortenString(record.nodeIdAddress)}
            >
              <ValidatorIcon
                iconUrl={record.validator?.metagraphNode?.iconUrl}
                size={7}
              />
              <Link
                className="text-hgtp-blue-600"
                href={`/address/${record.nodeIdAddress}`}
              >
                {shortenString(
                  record.validator?.nodeMetadataParameters.name ??
                    record.nodeIdAddress,
                  15,
                  15
                )}
              </Link>
            </Tooltip>
          ),
          amount: (value) => (
            <FormatCurrency
              value={datumToDag(value)}
              currency="DAG"
              decimals={{ max: 2 }}
            />
          ),
          validator: (value, record) =>
            record.validator
              ? decodeDecimal(
                  datumToDag(
                    record.validator.delegatedStakeRewardParameters
                      .rewardFraction
                  )
                )
                  .mul(100)
                  .toNumber() + "%"
              : "--",
          fee: (_, record) => (
            <>{formatNumberWithDecimals(getAPRForDelegation(record))}%</>
          ),
          snapshot: (value) => (
            <SuspenseValue
              value={value ? dayjs(value.timestamp).format("MM/DD/YYYY") : "--"}
              fallback={<SkeletonSpan className="w-10" />}
            />
          ),
          withdrawalStartEpoch: (value, record) =>
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
                Locked
              </span>
            ) : (
              <Tooltip
                renderAs="span"
                className={clsx(
                  "flex gap-1 items-center justify-center",
                  "text-ltx-gold-950 font-medium text-xs",
                  "bg-ltx-gold-300",
                  "rounded-3xl",
                  "h-6 px-3"
                )}
                tooltip={{
                  place: "left",
                }}
                renderTooltip={
                  <div
                    className={clsx(
                      "card flex flex-col gap-3 p-4 min-w-[168px]",
                      "text-sm"
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <span className=" font-medium text-gray-700">
                        Epochs remaining
                      </span>
                      <span className="flex gap-2 items-center">
                        <HourglassIcon className="size-4 shrink-0 text-gray-600" />
                        {epochProgress !== null &&
                        record.withdrawalEndEpoch !== null
                          ? record.withdrawalEndEpoch - epochProgress
                          : "--"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-medium text-gray-700">
                        Est. time remaining
                      </span>
                      <span className="flex gap-2 items-center">
                        <CalendarClock4Icon className="size-4 shrink-0 text-gray-600" />
                        {epochProgress !== null &&
                        record.withdrawalEndEpoch !== null
                          ? dayjs
                              .duration(
                                (record.withdrawalEndEpoch - epochProgress) *
                                  NetworkEpochInSeconds,
                                "seconds"
                              )
                              .humanize()
                          : "--"}
                      </span>
                    </div>
                  </div>
                }
              >
                Unlocking
              </Tooltip>
            ),
          rewardAmount: (value) => (
            <FormatCurrency
              value={datumToDag(value)}
              currency="DAG"
              decimals={{ max: 2 }}
            />
          ),
          withdrawalEndEpoch: (value, record) => (
            <DelegatedPositionActions
              validator={record.validator}
              delegation={record}
            />
          ),
        }}
      />
    </Section>
  );
};
