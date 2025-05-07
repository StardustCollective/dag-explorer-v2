"use client";

import { datumToDag } from "@/common/currencies";
import { FormatCurrency } from "@/components/FormatCurrency";
import { Section } from "@/components/Section";
import { StatCard } from "@/components/StatCard";
import { useDelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";

export const DelegationsStats = () => {
  const { userDelegations } = useDelegatedStakeProvider();

  return (
    <Section
      title="Delegation stats"
      className="flex flex-col lg:flex-row flex-nowrap gap-6"
    >
      <StatCard
        label="Total DAG delegated"
        tooltip={
          <>
            The total amount of DAG tokens currently delegated across all
            validators. This represents your active staking positions that are
            earning rewards.
          </>
        }
      >
        <FormatCurrency
          value={datumToDag(
            (userDelegations ?? []).reduce((pv, cv) => pv + cv.amount, 0) -
              (userDelegations ?? []).reduce(
                (pv, cv) =>
                  pv + (cv.withdrawalStartEpoch !== null ? cv.amount : 0),
                0
              )
          )}
          currency="DAG"
          decimals={{ max: 2 }}
          millifyFrom={1e3}
        />
      </StatCard>
      <StatCard
        label="Total DAG Unlocking"
        tooltip={
          <>
            DAG tokens being unlocked from delegated positions. No longer
            earning rewards, will be withdrawn automatically.
          </>
        }
      >
        <FormatCurrency
          value={datumToDag(
            (userDelegations ?? []).reduce(
              (pv, cv) =>
                pv + (cv.withdrawalStartEpoch !== null ? cv.amount : 0),
              0
            )
          )}
          currency="DAG"
          decimals={{ max: 2 }}
          millifyFrom={1e3}
        />
      </StatCard>
      <StatCard
        label="Current rewards earned"
        tooltip={
          <>
            The total amount of DAG tokens that have been earned as rewards from
            your active staking positions.
          </>
        }
      >
        <FormatCurrency
          value={datumToDag(
            (userDelegations ?? []).reduce((pv, cv) => pv + cv.rewardAmount, 0)
          )}
          currency="DAG"
          decimals={{ max: 2 }}
          millifyFrom={1e3}
        />
      </StatCard>
    </Section>
  );
};
