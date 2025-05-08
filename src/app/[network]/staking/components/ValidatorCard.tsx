"use client";

import { datumToDag } from "@/common/currencies";
import { ValidatorCard as ValidatorCardBase } from "@/components/ValidatorCard";
import { useDelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";
import { IAPIMetagraphStakingNode, IL0StakingDelegator } from "@/types/staking";
import { decodeDecimal } from "@/utils";

export type IValidatorCardProps = {
  delegator: IL0StakingDelegator;
  delegatorMetagraph?: IAPIMetagraphStakingNode;
};

export const ValidatorCard = ({
  delegator,
  delegatorMetagraph,
}: IValidatorCardProps) => {
  const { userDelegationsMap, requestAction_stake } =
    useDelegatedStakeProvider();

  const userDelegation = userDelegationsMap?.[delegator.peerId];

  return (
    <ValidatorCardBase
      nodeId={delegator.peerId}
      type={delegatorMetagraph ? "metagraph" : "validator"}
      title={delegator.nodeMetadataParameters.name}
      subtitle={delegatorMetagraph?.name}
      iconUrl={delegatorMetagraph?.iconUrl ?? undefined}
      delegatedAmountInDAG={datumToDag(delegator.totalAmountDelegated)}
      commissionPercentage={decodeDecimal(
        datumToDag(delegator.delegatedStakeRewardParameters.rewardFraction)
      )
        .mul(100)
        .toNumber()}
      description={delegator.nodeMetadataParameters.description}
      userDelegation={userDelegation}
      onStake={
        userDelegationsMap ? () => requestAction_stake(delegator) : undefined
      }
    />
  );
};
