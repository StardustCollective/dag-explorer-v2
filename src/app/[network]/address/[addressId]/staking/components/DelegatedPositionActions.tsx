"use client";

import clsx from "clsx";
import { useState } from "react";

import { MenuCard, MenuCardOption } from "@/components/MenuCard";
import { useDelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";
import { IAPIStakingDelegator, IL0StakingDelegation } from "@/types/staking";

import CoinsRemoveIcon from "@/assets/icons/coins-remove.svg";
import DotGrid1x3HorizontalIcon from "@/assets/icons/dot-grid-1x3-horizontal.svg";
import MoneyHandIcon from "@/assets/icons/money-hand.svg";

export type IDelegatedPositionActionsProps = {
  delegation?: IL0StakingDelegation;
  validator?: IAPIStakingDelegator;
};

export const DelegatedPositionActions = ({
  delegation,
  validator,
}: IDelegatedPositionActionsProps) => {
  const [open, setOpen] = useState(false);

  const { requestAction_changeValidator, requestAction_withdraw } =
    useDelegatedStakeProvider();

  return (
    <span className="flex items-center justify-center w-full relative">
      <span
        className={clsx(
          "flex items-center justify-center",
          "size-8",
          "rounded-full border border-gray-300",
          "hover:border-hgtp-blue-600 hover:bg-hgtp-blue-50",
          "cursor-pointer"
        )}
        onClick={() => setOpen(!open)}
      >
        <DotGrid1x3HorizontalIcon className="size-4 text-hgtp-blue-600 shrink-0" />
      </span>
      {open && (
        <MenuCard
          className="absolute right-full ml-2.5 w-fit z-10"
          onClickOutside={() => setOpen(false)}
        >
          <MenuCardOption
            disabled={delegation?.withdrawalStartEpoch !== null}
            onClick={() => {
              if (delegation) {
                requestAction_withdraw(delegation);
              }
              setOpen(false);
            }}
          >
            <CoinsRemoveIcon className="size-6 shrink-0" />
            Unstake DAG
          </MenuCardOption>
          <MenuCardOption
            disabled={delegation?.withdrawalStartEpoch !== null}
            onClick={() => {
              if (delegation && validator) {
                requestAction_changeValidator(delegation, validator);
              }
              setOpen(false);
            }}
          >
            <MoneyHandIcon className="size-6 shrink-0" />
            Change validator
          </MenuCardOption>
        </MenuCard>
      )}
    </span>
  );
};
