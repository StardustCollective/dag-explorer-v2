"use client";

import { datumToDag } from "@/common/currencies";
import { FormatCurrency } from "@/components/FormatCurrency";
import { StatCard } from "@/components/StatCard";
import { useDelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";

export type IValidatorStatsProps = Record<string, never>;

export const ValidatorStats = ({}: IValidatorStatsProps) => {
  const { validators } = useDelegatedStakeProvider();

  return (
    <>
      <StatCard label="Total DAG staked">
        <FormatCurrency
          currency="DAG"
          decimals={{ max: 2 }}
          millifyFrom={1e6}
          value={datumToDag(
            (validators ?? []).reduce(
              (pv, cv) => pv + cv.totalAmountDelegated,
              0
            )
          )}
        />
      </StatCard>
      <StatCard label="Total delegators">
        {(validators ?? []).reduce(
          (pv, cv) => pv + cv.totalAddressesAssigned,
          0
        )}
      </StatCard>
      <StatCard label="Total validators">{(validators ?? []).length}</StatCard>
      {/**
       * @todo: add estimated APY from new BE/L0/L1 API
       */}
      {/* <StatCard label="Estimated APY">{10}%</StatCard> */}
    </>
  );
};
