import clsx from "clsx";
import dayjs from "dayjs";
import React from "react";



import { DelegatedStakeNetworkLockHours, HgtpNetwork } from "@/common/consts";
import { PropertiesCard } from "@/components/PropertiesCard";

import CloseIcon from "@/assets/icons/close.svg";
import CoinsRemoveIcon from "@/assets/icons/coins-remove.svg";
import WarningIcon from "@/assets/icons/warning.svg";

export type IDelegatedStakeWithdrawCard_WithdrawCardProps = {
  network: HgtpNetwork;
  validatorName: React.ReactNode;
  amountStaked: React.ReactNode;
  totalRewards: React.ReactNode;
  unwindingPeriod: React.ReactNode;
  unlockEpoch: React.ReactNode;
  unlockTime: React.ReactNode;
  actionName?: React.ReactNode;
  onCancel?: () => void;
  onAction?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
};

export const DelegatedStakeWithdrawCard_WithdrawCard = ({
  network,
  validatorName,
  amountStaked,
  totalRewards,
  unwindingPeriod,
  unlockEpoch,
  unlockTime,
  actionName,
  onCancel,
  onAction,
  ref,
  disabled,
  className,
}: IDelegatedStakeWithdrawCard_WithdrawCardProps) => {
  return (
    <div className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)} ref={ref}>
      <div className="header flex items-center justify-between px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
        <div className="flex items-center gap-2">
          <CoinsRemoveIcon className="size-8 shrink-0" />
          Unstake DAG
        </div>
        <CloseIcon
          className="size-8 shrink-0 text-gray-600"
          onClick={onCancel}
        />
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Validator details
          </span>
          <div className="flex flex-col gap-3">
            <PropertiesCard
              variants={["compact"]}
              rows={[
                {
                  label: <>Validator</>,
                  value: validatorName,
                },
                {
                  label: <>Amount staked</>,
                  value: amountStaked,
                },
                {
                  label: <>Total rewards</>,
                  value: totalRewards,
                },
                {
                  label: <>Unwinding period</>,
                  value: unwindingPeriod,
                },
                {
                  label: <>Unlock epoch</>,
                  value: unlockEpoch,
                },
                {
                  label: <>Unlock time</>,
                  value: unlockTime,
                },
              ]}
            />
            <div className="card flex items-center gap-2.5 p-3">
              <WarningIcon className="size-5 text-ltx-gold-600 shrink-0" />
              <span className="text-xs text-gray-600">
                Unstaking will have a{" "}
                {dayjs
                  .duration(DelegatedStakeNetworkLockHours[network], "hours")
                  .humanize()}{" "}
                unwinding period until your DAG will become available to use.
              </span>
            </div>
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
