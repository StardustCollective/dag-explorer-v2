import Decimal from "decimal.js";

import { HgtpNetwork } from "@/common/consts/network";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { StatCard } from "@/components/StatCard";
import { ValidatorCard } from "@/components/ValidatorCard";
import {
  formatCurrencyWithDecimals,
  shortenString,
} from "@/utils";

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
    <>
      <PageTitle>Delegated Staking</PageTitle>
      <PageLayout className="flex flex-col gap-10 px-20 py-8" renderAs={"main"}>
        <Section title="Network overview" className="flex flex-nowrap gap-6">
          <StatCard label="Total DAG staked">
            {formatCurrencyWithDecimals("DAG", Date.now() / 10000, { max: 0 })}
          </StatCard>
          <StatCard label="Total delegators">{46}</StatCard>
          <StatCard label="Total validators">{32}</StatCard>
          <StatCard label="Estimated APY">{10}%</StatCard>
        </Section>
        <Section title="Validators" className="grid grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <ValidatorCard
              key={i}
              type={i % 2 === 0 ? "metagraph" : "validator"}
              subtitle={i % 2 === 0 ? "DOR" : "Panasonic"}
              title={
                i % 2 === 0
                  ? shortenString("DAG6Yxge8Tzd8DJDJeL4hMLntnhheHGR4DYSPQvf")
                  : "Joao's node"
              }
              logoUrl="https://icons-metagraph.s3.amazonaws.com/DOR/dortoken_red.svg"
              delegatedAmount={new Decimal(i % 2 === 0 ? 1e6 : 1e5)}
              commissionPercentage={5}
              description={
                i % 2 === 0
                  ? "Powering the Constellation Network with secure, high-performance validation. Maximizing uptime, optimizing rewards, and decentralizing the future..."
                  : "Block of description text will go here. It will be 2 to 3 lines maximum before we start truncating the paragraph. This should give us enough space to describe the node..."
              }
            />
          ))}
        </Section>
      </PageLayout>
    </>
  );
}
