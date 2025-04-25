import clsx from "clsx";

import { InfoTooltip } from "../Tooltip";

import { formatCurrencyWithDecimals } from "@/utils";

import Brain2Icon from "@/assets/icons/brain-2.svg";
import FileLockIcon from "@/assets/icons/file-lock.svg";

export type IValidatorCardProps = {
  nodeId: string;
  commissionPercentage: number;
  type?: "metagraph" | "validator";
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  delegatedAmountInDAG?: IDecimal;
  userDelegatedAmountInDAG?: IDecimal;
  description?: string;
  onStake?: () => void;
};

export const ValidatorCard = ({
  type,
  title,
  subtitle,
  logoUrl,
  delegatedAmountInDAG,
  userDelegatedAmountInDAG,
  commissionPercentage,
  description,
  onStake,
}: IValidatorCardProps) => {
  return (
    <div className="card flex flex-col w-full">
      <div className="header flex px-5 py-4 justify-between">
        <div className="flex gap-3">
          <div className="size-10 rounded-full border border-black/25"></div>
          <div className="flex flex-col font-medium">
            <span className="text-hgtp-blue-600">{title}</span>
            <span className="text-hgtp-blue-950 text-sm">
              {subtitle ?? "--"}
            </span>
          </div>
        </div>
        <div className="hidden md:inline-block">
          <ValidatorTypeChip type={type} />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 grow">
        <div className="flex gap-6">
          <div className="flex flex-col w-full gap-1">
            <span className="text-gray-600 text-xs font-semibold">
              Total delegated <InfoTooltip />
            </span>
            <span className="text-hgtp-blue-900 text-lg">
              {formatCurrencyWithDecimals("DAG", delegatedAmountInDAG)}
            </span>
          </div>
          <div className="flex flex-col w-full gap-1">
            <span className="text-gray-600 text-xs font-semibold">
              Validator commission <InfoTooltip />
            </span>
            <span className="text-hgtp-blue-900 text-lg">
              {commissionPercentage}%
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-600">{description}</div>
        <div className="md:hidden">
          <ValidatorTypeChip type={type} />
        </div>
      </div>

      {onStake && (
        <div className="footer flex items-center justify-between py-3.5 px-5">
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs font-semibold">
              Your total delegation <InfoTooltip />
            </span>
            <span className="text-hgtp-blue-900 text-xl">
              {formatCurrencyWithDecimals("DAG", userDelegatedAmountInDAG)}
            </span>
          </div>
          <button className="button secondary sm font-medium" onClick={onStake}>
            Stake
          </button>
        </div>
      )}
    </div>
  );
};
