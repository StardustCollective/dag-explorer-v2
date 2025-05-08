import { MiddleTruncate } from "@re-dev/react-truncate";
import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

import { datumToDag } from "@/common/currencies";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PropertiesCard } from "@/components/PropertiesCard";
import { RoundedIcon } from "@/components/RoundedIcon";
import { InfoTooltip } from "@/components/Tooltip";
import { ValidatorIcon } from "@/components/ValidatorIcon";
import { IBEActionTransaction_TokenLock } from "@/types";
import { IAPIStakingDelegator } from "@/types/staking";
import { decodeDecimal, shortenString } from "@/utils";

import ArrowBoxRightIcon from "@/assets/icons/arrow-box-right.svg";
import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import CloseIcon from "@/assets/icons/close.svg";
import LockedIcon from "@/assets/icons/locked.svg";

const ValidatorInfo = ({
  label,
  validator,
}: {
  label: string;
  validator: IAPIStakingDelegator;
}) => {
  return (
    <div className="flex flex-col gap-3 items-center px-2 w-[150px]">
      <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
        {label}
      </span>
      <div className="flex flex-col gap-3 items-center w-full">
        <ValidatorIcon iconUrl={validator.metagraphNode?.iconUrl} size={10} />
        <div className="flex flex-col items-center w-full">
          <span className="text-sm">
            {shortenString(validator.nodeIdAddress)}
          </span>
          <span className="text-xs font-medium text-hgtp-blue-700 w-full">
            <MiddleTruncate>
              {validator.nodeMetadataParameters.name ?? "--"}
            </MiddleTruncate>
          </span>
        </div>
      </div>
    </div>
  );
};

export type IDelegatedStakeAssignValidatorCard_ReviewCardProps = {
  tokenLock: IBEActionTransaction_TokenLock;
  delegator: IAPIStakingDelegator;
  actionName?: React.ReactNode;
  onCancel?: () => void;
  onAction?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
};

export const DelegatedStakeAssignValidatorCard_ReviewCard = ({
  tokenLock,
  delegator,
  actionName,
  onCancel,
  onAction,
  ref,
  disabled,
  className,
}: IDelegatedStakeAssignValidatorCard_ReviewCardProps) => {
  return (
    <div
      className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)}
      ref={ref}
    >
      <div className="header flex items-center justify-between px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
        <div className="flex items-center gap-2">
          <ArrowBoxRightIcon className="size-8 shrink-0" />
          Assign validator
        </div>
        <CloseIcon
          className="size-8 shrink-0 text-gray-600"
          onClick={onCancel}
        />
      </div>
      <div className="flex flex-col gap-6 px-6 py-4">
        <div className="flex flex-row justify-around items-center">
          <div className="flex flex-col gap-3 items-center px-2 w-[150px]">
            <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
              Pending lock
            </span>
            <div className="flex flex-col gap-3 items-center w-full">
              <RoundedIcon
                className="border-yellow-400"
                size={10}
                fallback={
                  <LockedIcon className="size-6 shrink-0 text-ltx-gold-600" />
                }
              />
              <div className="flex flex-col items-center w-full">
                <span className="text-sm">
                  {dayjs(tokenLock.timestamp).fromNow()}
                </span>
                <span className="text-xs font-medium text-hgtp-blue-700 w-full">
                  <Link
                    className="text-hgtp-blue-600 text-sm"
                    href={`/transactions/${tokenLock.hash}/TokenLock`}
                  >
                    <MiddleTruncate>{tokenLock.hash}</MiddleTruncate>
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center rounded-full bg-hgtp-blue-50 size-8">
            <ArrowRightIcon className="size-5 shrink-0 text-hgtp-blue-600" />
          </div>
          <ValidatorInfo label="New validator" validator={delegator} />
        </div>
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Transaction details
          </span>
          <div className="flex w-full">
            <PropertiesCard
              className="w-full"
              variants={["compact"]}
              rows={[
                {
                  label: (
                    <>
                      Transfer amount{" "}
                      <InfoTooltip content="The total amount of DAG to be assigned to this validator" />
                    </>
                  ),
                  value: (
                    <FormatCurrency
                      currency="DAG"
                      value={datumToDag(tokenLock.amount)}
                    />
                  ),
                },
                {
                  label: (
                    <>
                      Validator commission{" "}
                      <InfoTooltip
                        content={
                          <>
                            The percentage of your rewards that will be received
                            by the validator. Your delegated DAG is not affected
                            by this commission!
                          </>
                        }
                      />
                    </>
                  ),
                  value:
                    decodeDecimal(
                      datumToDag(
                        delegator?.delegatedStakeRewardParameters
                          .rewardFraction ?? 0
                      )
                    )
                      .mul(100)
                      .toNumber() + "%",
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="footer grid grid-cols-2 gap-4 px-6 py-5">
        <button className="button tertiary md" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="button secondary md"
          disabled={disabled}
          onClick={onAction}
        >
          {actionName}
        </button>
      </div>
    </div>
  );
};
