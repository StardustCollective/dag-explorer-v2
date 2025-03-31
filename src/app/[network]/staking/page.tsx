import { dag4 } from "@stardust-collective/dag4";

import { StakingActionsProvider } from "./components/StakingActionsProvider";
import { ValidatorCard } from "./components/ValidatorCard";

import { HgtpNetwork } from "@/common/consts/network";
import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { FormatCurrency } from "@/components/FormatCurrency";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { StatCard } from "@/components/StatCard";
import { getStakingDelegators } from "@/queries";
import { shortenString } from "@/utils";

import Server1Icon from "@/assets/icons/server-1.svg";

export const revalidate = 15;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function DelegatedStakingPage({
  params,
}: {
  params: Promise<{ network: string }>;
}) {
  const network = await getNetworkFromParamsOrFail(params);
  const validators = await getStakingDelegators(network);

  return (
    <StakingActionsProvider>
      <PageTitle icon={<Server1Icon className="size-8" />}>
        Delegated Staking
      </PageTitle>
      <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
        <Section title="Network overview" className="flex flex-nowrap gap-6">
          <StatCard label="Total DAG staked">
            <FormatCurrency
              currency="DAG"
              value={datumToDag(
                validators.reduce((pv, cv) => pv + cv.totalAmountDelegated, 0)
              )}
            />
          </StatCard>
          <StatCard label="Total delegators">{validators.length}</StatCard>
          <StatCard label="Total validators">{validators.length}</StatCard>
          <StatCard label="Estimated APY">{10}%</StatCard>
        </Section>
        <Section title="Validators" className="grid grid-cols-3 gap-6">
          {validators.map((validator) => (
            <ValidatorCard
              key={validator.node.id}
              nodeId={validator.node.id}
              type={"validator"}
              subtitle={validator.nodeMetadataParameters.name}
              title={shortenString(
                dag4.keyStore.getDagAddressFromPublicKey(validator.node.id)
              )}
              logoUrl="https://icons-metagraph.s3.amazonaws.com/DOR/dortoken_red.svg"
              delegatedAmountInDAG={datumToDag(validator.totalAmountDelegated)}
              commissionPercentage={
                validator.delegatedStakeRewardParameters.rewardFraction / 1000
              }
              description={validator.nodeMetadataParameters.description}
            />
          ))}
        </Section>
      </PageLayout>
    </StakingActionsProvider>
  );
}
