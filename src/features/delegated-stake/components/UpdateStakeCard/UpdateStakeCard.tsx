import clsx from "clsx";
import React from "react";

import { AmountInput } from "@/components/AmountInput";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PropertiesCard } from "@/components/PropertiesCard";
import { InfoTooltip } from "@/components/Tooltip";
import { decodeDecimal, formatCurrencyWithDecimals } from "@/utils";

import CloseIcon from "@/assets/icons/close.svg";
import CoinsEditIcon from "@/assets/icons/coins-add.svg";
import WalletIcon from "@/assets/icons/wallet.svg";

export type IUpdateStakeCardProps = {
  walletBalanceInDAG: IDecimal;
  currentStakeAmount: IDecimal;
  validatorName: React.ReactNode;
  totalDelegated: React.ReactNode;
  validatorCommission: React.ReactNode;
  unstakingPeriod: React.ReactNode;
  status?: React.ReactNode;
  actionName?: React.ReactNode;
  value: IDecimal;
  onValueChange: (amount: IDecimal) => void;
  onCancel?: () => void;
  onAction?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
};

export const UpdateStakeCard = ({
  walletBalanceInDAG,
  currentStakeAmount,
  validatorName,
  totalDelegated,
  validatorCommission,
  unstakingPeriod,
  status,
  actionName,
  value,
  onValueChange,
  onCancel,
  onAction,
  ref,
  disabled,
  className,
}: IUpdateStakeCardProps) => {
  const availableBalance = decodeDecimal(walletBalanceInDAG);

  return (
    <div
      className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)}
      ref={ref}
    >
      <div className="header flex items-center justify-between px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
        <div className="flex items-center gap-2">
          <CoinsEditIcon className="size-8 shrink-0" />
          Increase Stake
        </div>
        <CloseIcon
          className="size-8 shrink-0 text-gray-600 cursor-pointer"
          onClick={onCancel}
        />
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Delegation overview
          </span>
          <PropertiesCard
            variants={["compact"]}
            rows={[
              {
                label: "Current stake",
                value: <FormatCurrency currency="DAG" value={currentStakeAmount} />,
              },
              {
                label: "New total",
                value: <FormatCurrency currency="DAG" value={decodeDecimal(currentStakeAmount).add(decodeDecimal(value))} />,
              },
            ]}
          />
        </div>
        <div>
          <AmountInput
            title={<>Amount to increase</>}
            caption={
              <span className="flex justify-between items-center w-full">
                <span className="flex items-center gap-1.5">
                  <WalletIcon className="size-5 text-hgtp-blue-700 shrink-0" />
                  <span className="font-medium">Available:</span>
                  {formatCurrencyWithDecimals("DAG", availableBalance)}
                </span>
                <span className="text-gray-600 text-xs font-medium">
                  Amount to add to your current stake
                </span>
              </span>
            }
            valueChildren={
              <>
                <span
                  className="chip sm"
                  onClick={() =>
                    onValueChange(availableBalance.mul(0.5))
                  }
                >
                  50%
                </span>
                <span
                  className="chip sm"
                  onClick={() => onValueChange(availableBalance)}
                >
                  Max
                </span>
              </>
            }
            value={value}
            minValue={0}
            maxValue={availableBalance}
            onValueChange={onValueChange}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Validator details
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
                      Total delegated{" "}
                      <InfoTooltip content="The total amount of DAG that is delegated to this validator" />
                    </>
                  ),
                  value: totalDelegated,
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
                  value: validatorCommission,
                },
                {
                  label: (
                    <>
                      Unstaking period{" "}
                      <InfoTooltip
                        content={
                          <>
                            The average time it will take for you to receive
                            your Delegated DAG and delegation rewards after you
                            initiate a withdrawal. During this period, you will
                            not be receiving extra rewards from your position
                          </>
                        }
                      />
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
                  label: "Update token lock",
                  value: status,
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
