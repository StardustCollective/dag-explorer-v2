"use client";

import Decimal from "decimal.js";

import { useStakingActionsProvider } from "./StakingActionsProvider";

import {
  ValidatorCard as ValidatorCardBase,
  IValidatorCardProps,
} from "@/components/ValidatorCard";
import { decodeDecimal, encodeDecimal } from "@/utils";

export const ValidatorCard = (props: IValidatorCardProps) => {
  const stakingActions = useStakingActionsProvider();

  const userDelegatedAmount = decodeDecimal(
    stakingActions.userDelegatedAmounts?.[props.nodeId] ?? new Decimal(0)
  );

  return (
    <ValidatorCardBase
      {...props}
      userDelegatedAmountInDAG={encodeDecimal(userDelegatedAmount.div(1e8))}
      onStake={
        stakingActions.userDelegatedAmounts !== undefined
          ? () =>
              stakingActions.requestStaking(
                props.nodeId,
                props.commissionPercentage
              )
          : undefined
      }
    />
  );
};
