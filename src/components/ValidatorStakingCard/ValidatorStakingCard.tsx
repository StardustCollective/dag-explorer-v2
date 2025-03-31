import clsx from "clsx";
import React from "react";

import { AmountInput } from "../AmountInput";
import { PropertiesCard } from "../PropertiesCard";
import { InfoTooltip } from "../Tooltip";

import { decodeDecimal, formatCurrencyWithDecimals } from "@/utils";

import CoinsAddIcon from "@/assets/icons/coins-add.svg";
import WalletIcon from "@/assets/icons/wallet.svg";

export type IValidatorStakingCardProps = {
  walletBalanceInDAG: IDecimal;
  validatorName: React.ReactNode;
  totalDelegated: React.ReactNode;
  estimatedApy: React.ReactNode;
  validatorCommission: React.ReactNode;
  unstakingPeriod: React.ReactNode;
  statuses?: {
    step1: React.ReactNode;
    step2: React.ReactNode;
  };
  value: IDecimal;
  onValueChange: (amount: IDecimal) => void;
  onCancel?: () => void;
  onStake?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
};

export const ValidatorStakingCard = ({
  walletBalanceInDAG,
  validatorName,
  totalDelegated,
  estimatedApy,
  validatorCommission,
  unstakingPeriod,
  statuses,
  value,
  onValueChange,
  onCancel,
  onStake,
  ref,
  disabled,
  className,
}: IValidatorStakingCardProps) => {
  return (
    <div className={clsx("card w-11/12 max-w-[490px]", className)} ref={ref}>
      <div className="header flex items-center gap-2 px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
        <CoinsAddIcon className="size-8" />
        Stake DAG
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div>
          <AmountInput
            title={
              <>
                Delegation amount <InfoTooltip />
              </>
            }
            caption={
              <>
                <WalletIcon className="size-5 text-hgtp-blue-700" />
                <span className="font-medium">Balance:</span>
                {formatCurrencyWithDecimals("DAG", walletBalanceInDAG)}
              </>
            }
            valueChildren={
              <>
                <span
                  className="chip sm"
                  onClick={() => onValueChange(decodeDecimal(value).mul(0.5))}
                >
                  50%
                </span>
                <span
                  className="chip sm"
                  onClick={() => onValueChange(walletBalanceInDAG)}
                >
                  Max
                </span>
              </>
            }
            value={value}
            onValueChange={onValueChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Validator details <InfoTooltip />
          </span>
          <div className="flex flex-col gap-3">
            <PropertiesCard
              variants={["compact"]}
              rows={[
                {
                  label: "Validator",
                  value: validatorName,
                },
                {
                  label: (
                    <>
                      Total delegated <InfoTooltip />
                    </>
                  ),
                  value: totalDelegated,
                },
                // {
                //   label: (
                //     <>
                //       Estimated APY <InfoTooltip />
                //     </>
                //   ),
                //   value: estimatedApy,
                // },
                {
                  label: (
                    <>
                      Validator commission <InfoTooltip />
                    </>
                  ),
                  value: validatorCommission,
                },
                {
                  label: (
                    <>
                      Unstaking period <InfoTooltip />
                    </>
                  ),
                  value: unstakingPeriod,
                },
              ]}
            />
            <PropertiesCard
              variants={["compact"]}
              rows={[
                {
                  label: "Step 1: Lock DAG",
                  value: statuses?.step1,
                },
                {
                  label: "Step 2: Delegate to validators",
                  value: statuses?.step1,
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
          onClick={onStake}
        >
          Lock DAG
        </button>
      </div>
    </div>
  );
};
