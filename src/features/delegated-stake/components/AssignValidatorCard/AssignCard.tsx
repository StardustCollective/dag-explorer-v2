import { MiddleTruncate } from "@re-dev/react-truncate";
import clsx from "clsx";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import Link from "next/link";
import React from "react";


import { CopyAction } from "@/components/CopyAction";
import { SearchBar } from "@/components/SearchBar";
import { ValidatorIcon } from "@/components/ValidatorIcon";
import { IBEActionTransaction_TokenLock } from "@/types";
import { IAPIStakingDelegator } from "@/types/staking";
import { shortenString } from "@/utils";

import ArrowBoxRightIcon from "@/assets/icons/arrow-box-right.svg";
import CircleCheckOutlineIcon from "@/assets/icons/circle-check-outline.svg";
import CloseIcon from "@/assets/icons/close.svg";

const ValidatorInfo = ({
  validator,
  selected,
  onSelect,
}: {
  validator: IAPIStakingDelegator;
  selected?: boolean;
  onSelect?: (validator: IAPIStakingDelegator) => void;
}) => {
  return (
    <div key={validator.peerId} className="flex justify-between gap-1">
      <div className="flex gap-3 items-center grow">
        <ValidatorIcon iconUrl={validator.metagraphNode?.iconUrl} size={7} />
        <div className="flex flex-col grow">
          <span className="text-sm">
            {shortenString(validator.nodeIdAddress)}
          </span>
          <span className="text-xs font-medium text-gray-600 grow">
            <MiddleTruncate>
              {validator.nodeMetadataParameters.name ?? "--"}
            </MiddleTruncate>
          </span>
        </div>
      </div>
      {!selected && onSelect && (
        <button
          className="button primary outlined xs"
          onClick={() => onSelect(validator)}
        >
          Select
        </button>
      )}
      {selected && onSelect && (
        <button
          className="button primary outlined xs"
          onClick={() => onSelect(validator)}
        >
          Selected
          <CircleCheckOutlineIcon className="size-5 shrink-0" />
        </button>
      )}
    </div>
  );
};

export type IDelegatedStakeAssignValidatorCard_AssignCardProps = {
  tokenLock: IBEActionTransaction_TokenLock;
  selectedValidator?: IAPIStakingDelegator | null;
  validators: IAPIStakingDelegator[];
  actionName?: React.ReactNode;
  search: string;
  onSearchChange: (search: string) => void;
  onSelectValidator: (validator: IAPIStakingDelegator) => void;
  onCancel?: () => void;
  onAction?: () => void;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
  className?: string;
};

export const DelegatedStakeAssignValidatorCard_AssignCard = ({
  tokenLock,
  selectedValidator,
  validators,
  actionName,
  search,
  onSearchChange,
  onSelectValidator,
  onCancel,
  onAction,
  ref,
  disabled,
  className,
}: IDelegatedStakeAssignValidatorCard_AssignCardProps) => {
  const fuse = new Fuse(validators, {
    includeScore: true,
    threshold: 0.2,
    keys: ["nodeMetadataParameters.name", "nodeIdAddress", "peerId"],
  });

  const filteredValidators = search
    ? fuse.search(search).map((v) => v.item)
    : validators;

  return (
    <div className={clsx("card shadow-sm w-11/12 max-w-[490px]", className)} ref={ref}>
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
        <SearchBar
          variant="minik"
          placeholder="Search by metagraph or validator name"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Token lock
          </span>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm">
                <Link
                  className="text-hgtp-blue-600"
                  href={`/transactions/${tokenLock.hash}/TokenLock`}
                >
                  {shortenString(tokenLock.hash, 8, 8)}
                </Link>{" "}
                <CopyAction value={tokenLock.hash} />
              </span>
              <span className="text-xs font-medium text-gray-600">
                {dayjs(tokenLock.timestamp).fromNow()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
            Top validators
          </span>
          <div className="card flex flex-col gap-4 p-4 h-[340px] overflow-y-auto">
            {filteredValidators.map((validator) => (
              <ValidatorInfo
                key={validator.peerId}
                validator={validator}
                selected={validator.peerId === selectedValidator?.peerId}
                onSelect={onSelectValidator}
              />
            ))}
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
