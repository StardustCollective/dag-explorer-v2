import { ClientDelegatedStakeProvider } from "./components/ClientDelegatedStakeProvider";
import { MyDelegationsLink } from "./components/MyDelegationsLink";
import { ValidatorCards } from "./components/ValidatorCards";
import { ValidatorStats } from "./components/ValidatorStats";

import { HgtpNetwork } from "@/common/consts/network";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { getStakingDelegators } from "@/queries";
import { ILimitOffsetPaginationSearchParams } from "@/types";
import { getPageSearchParamsOrDefaults, parseNumberOrDefault } from "@/utils";

import Server1FilledIcon from "@/assets/icons/server-1-filled.svg";

export const revalidate = 15;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function DelegatedStakingPage({
  params,
  searchParams,
}: {
  params: Promise<{ network: string }>;
  searchParams: Promise<
    {
      filter?: "metagraphs" | "validators";
    } & ILimitOffsetPaginationSearchParams
  >;
}) {
  const network = await getNetworkFromParamsOrFail(params);
  const validators = await getStakingDelegators(network);

  const [{ limit }] = await getPageSearchParamsOrDefaults(searchParams, {
    limit: "15",
    offset: "0",
  });

  return (
    <ClientDelegatedStakeProvider>
      <PageTitle icon={<Server1FilledIcon className="size-8 shrink-0" />}>
        Delegated Staking
      </PageTitle>
      <PageLayout
        className="flex flex-col gap-10 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <Section
          title="Network overview"
          className="flex flex-wrap lg:flex-nowrap gap-6"
        >
          <ValidatorStats />
        </Section>
        <Section
          title={`Validators (${validators.length})`}
          action={<MyDelegationsLink />}
          className="flex flex-col gap-6"
        >
          <ValidatorCards
            limit={parseNumberOrDefault(limit, 15)}
            filter={(await searchParams).filter}
          />
        </Section>
      </PageLayout>
    </ClientDelegatedStakeProvider>
  );
}
