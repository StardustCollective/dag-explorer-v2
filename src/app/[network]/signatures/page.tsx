import { SignaturesTable } from "./components/SignaturesTable";
import { SigningActions } from "./components/SigningActions";

import { HgtpNetwork } from "@/common/consts/network";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { VerifiedSignaturesProvider } from "@/features/verified-signatures/VerifiedSignaturesProvider";

import DocumentSignedIcon from "@/assets/icons/document-signed.svg";

export const revalidate = 15;

export const generateStaticParams = async () => {
  return Object.values(HgtpNetwork).map((network) => ({
    network,
  }));
};

export default async function SignaturesPage({
  params,
}: {
  params: Promise<{ network: string }>;
}) {
  await getNetworkFromParamsOrFail(params);

  return (
    <VerifiedSignaturesProvider>
      <PageTitle
        icon={<DocumentSignedIcon className="size-8 shrink-0" />}
        rightContent={<SigningActions />}
      >
        Verified Signatures
      </PageTitle>
      <PageLayout
        className="flex flex-col gap-10 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <Section
          title="Published verified signatures"
          className="flex flex-wrap lg:flex-nowrap gap-6"
        >
          <SignaturesTable />
        </Section>
      </PageLayout>
    </VerifiedSignaturesProvider>
  );
}
