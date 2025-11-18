import { MetagraphsTable } from "./components/MetagraphsTable";

import { HgtpNetwork } from "@/common/consts/network";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { INextTokenPaginationSearchParams } from "@/types";
import { getPageSearchParamsOrDefaults, parseNumberOrDefault } from "@/utils";

import Brain2FilledIcon from "@/assets/icons/brain-2-filled.svg";

export const revalidate = 15;

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function MetagraphsPage({
  params,
  searchParams,
}: {
  params: Promise<{ network: string }>;
  searchParams: Promise<INextTokenPaginationSearchParams>;
}) {
  const network = await getNetworkFromParamsOrFail(params);

  const [{ limit }] = await getPageSearchParamsOrDefaults(searchParams, {
    limit: "20",
  });

  return (
    <>
      <PageTitle icon={<Brain2FilledIcon className="size-8 shrink-0" />}>
        Metagraphs
      </PageTitle>
      <PageLayout
        className="flex flex-col gap-10 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <Section title="Top projects">
          <MetagraphsTable network={network} limit={parseNumberOrDefault(limit, 20)} />
        </Section>
      </PageLayout>
    </>
  );
}
