import clsx from "clsx";
import React from "react";

import { FormatCurrency } from "@/components/FormatCurrency";
import { PropertiesCard } from "@/components/PropertiesCard";

import CircleCheckOutlineIcon from "@/assets/icons/circle-check-outline.svg";
import CloseIcon from "@/assets/icons/close.svg";

export type IDelegatedStakeStakeCard_StakedCardProps = {
  validatorName: React.ReactNode;
  estimatedApy: React.ReactNode;
  validatorCommission: React.ReactNode;
  value: IDecimal;
  onClose?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
};

export const DelegatedStakeStakeCard_StakedCard = ({
  validatorName,
  estimatedApy,
  validatorCommission,
  value,
  onClose,
  ref,
  className,
}: IDelegatedStakeStakeCard_StakedCardProps) => {
  return (
    <div className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)} ref={ref}>
      <div className="flex flex-col gap-4 px-6 py-4">
        <div className="header flex items-center justify-between px-5 py-4.5 text-xl font-semibold text-hgtp-blue-900">
          <div className="flex items-center gap-2">
            <CircleCheckOutlineIcon className="size-14 text-green-500 shrink-0" />
            <span className="text-2xl font-semibold text-green-600">
              Staking successful!
            </span>
          </div>
          <CloseIcon
            className="size-8 shrink-0 text-gray-600"
            onClick={onClose}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Transaction details
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
                  label: "Your delegation",
                  value: <FormatCurrency currency="DAG" value={value} />,
                },
                // {
                //   label: (
                //     <>
                //       Estimated APY
                //     </>
                //   ),
                //   value: estimatedApy,
                // },
                {
                  label: "Validator commission",
                  value: validatorCommission,
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="footer flex gap-4 px-6 py-5">
        <button className="button primary outline md w-full" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
