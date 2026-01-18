import { MiddleTruncate } from "@re-dev/react-truncate";
import { dag4 } from "@stardust-collective/dag4";
import clsx from "clsx";
import Link from "next/link";
import { memo } from "react";

import { Tooltip } from "../Tooltip";
import { ValidatorIcon } from "../ValidatorIcon";

import {
  IValidatorTypeChipProps,
  ValidatorTypeChip,
} from "./ValidatorTypeChip";

import { datumToDag } from "@/common/currencies";
import { IL0StakingDelegation } from "@/types/staking";
import { formatCurrencyWithDecimals } from "@/utils";

export type IValidatorCardProps = {
  nodeId: string;
  commissionPercentage: number;
  type?: IValidatorTypeChipProps["type"];
  title?: string;
  subtitle?: string;
  iconUrl?: string;
  delegatedAmountInDAG?: IDecimal;
  description?: string;
  userDelegation?: IL0StakingDelegation;
  onStake?: () => void;
};

export const ValidatorCard = memo(function ValidatorCard({
  nodeId,
  type,
  title,
  subtitle,
  iconUrl,
  delegatedAmountInDAG,
  commissionPercentage,
  description,
  userDelegation,
  onStake,
}: IValidatorCardProps) {
  return (
    <div className="card shadow-sm flex flex-col w-full">
      <div className="header flex px-5 py-4 justify-between gap-1">
        <div className="flex gap-3 grow">
          <ValidatorIcon iconUrl={iconUrl} size={10} hideType />
          <div className="flex flex-col font-medium grow">
            <Tooltip
              renderAs={Link}
              className={clsx("flex grow", "text-hgtp-blue-600")}
              href={`/address/${dag4.keyStore.getDagAddressFromPublicKey(
                nodeId
              )}`}
              tooltip={{ place: "bottom" }}
              content={title ?? nodeId}
            >
              <MiddleTruncate>{title ?? nodeId}</MiddleTruncate>
            </Tooltip>
            <span className="text-hgtp-blue-950 text-sm">
              {subtitle ?? "--"}
            </span>
          </div>
        </div>
        <div className="hidden lg:inline-block">
          <ValidatorTypeChip type={type} />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 grow">
        <div className="flex gap-6">
          <div className="flex flex-col w-full gap-1">
            <span className="text-gray-600 text-xs font-semibold">
              Total delegated
            </span>
            <span className="text-hgtp-blue-900 text-lg">
              {formatCurrencyWithDecimals("DAG", delegatedAmountInDAG, {
                maxD: 2,
                millifyFrom: 1e3,
              })}
            </span>
          </div>
          <div className="flex flex-col w-full gap-1">
            <span className="text-gray-600 text-xs font-semibold">
              Validator commission
            </span>
            <span className="text-hgtp-blue-900 text-lg">
              {commissionPercentage}%
            </span>
          </div>
        </div>
        <div className="text-sm text-gray-600">{description}</div>
        <div className="lg:hidden">
          <ValidatorTypeChip type={type} />
        </div>
      </div>

      {onStake && (
        <div className="footer flex items-center justify-between py-3.5 px-5">
          <div className="flex flex-col">
            <span className="text-gray-600 text-xs font-semibold">
              Your total delegation
            </span>
            <span className={clsx("text-hgtp-blue-900 text-xl", !userDelegation?.amount && "opacity-60")}>
              {formatCurrencyWithDecimals(
                "DAG",
                datumToDag(userDelegation?.amount ?? 0),
                { maxD: 0, millifyFrom: 1e3 }
              )}
            </span>
          </div>
          <button
            className="button secondary sm font-medium"
            onClick={onStake}
          >
            {userDelegation?.withdrawalEndEpoch ? "Unwind Period" : "Stake DAG"}
          </button>
        </div>
      )}
    </div>
  );
});
