import clsx from "clsx";
import Decimal from "decimal.js";

import { formatCurrencyWithDecimals } from "@/utils";

export type IValidatorCardProps = {
  type?: "metagraph" | "validator";
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  delegatedAmount?: Decimal;
  commissionPercentage?: number;
  description?: string;
};

export const ValidatorCard = ({
  type,
  title,
  subtitle,
  logoUrl,
  delegatedAmount,
  commissionPercentage,
  description,
}: IValidatorCardProps) => {
  return (
    <div className="card w-full">
      <div className="header flex px-5 py-4 justify-between">
        <div className="flex gap-3">
          <div className="size-10 rounded-full border border-black/25"></div>
          <div className="flex flex-col font-semibold">
            <span className="text-hgtp-blue-600">{title}</span>
            <span className="text-hgtp-blue-950 text-sm">{subtitle ?? "--"}</span>
          </div>
        </div>
        <div
          className={clsx(
            "flex items-center px-2.5 gap-1 h-7 border-[0.5px] rounded-5xl",
            "font-semibold text-xs",
            type === "metagraph" &&
              "border-green-600 bg-green-600/5 text-green-600",
            type === "validator" &&
              "border-stgz-purple-700 bg-stgz-purple-700/5 text-stgz-purple-700"
          )}
        >
          {type === "metagraph" && "Metagraph"}
          {type === "validator" && "Validator"}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex gap-6">
          <div className="flex flex-col w-full">
            <span className="text-gray-600 text-xs">Total delegated</span>
            <span className="text-hgtp-blue-900 text-lg">
              {formatCurrencyWithDecimals("DAG", delegatedAmount)}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-gray-600 text-xs">Validator commission</span>
            <span className="text-hgtp-blue-900 text-lg">
              {commissionPercentage}%
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
};
