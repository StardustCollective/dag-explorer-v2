import { dag4 } from "@stardust-collective/dag4";
import { notFound, redirect } from "next/navigation";

import { DelegationsStats } from "./components/DelegationsStats";
import { DelegationsTable } from "./components/DelegationsTable";
import { PendingLocksTable } from "./components/PendingLocksTable";

import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { DelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";
import { isHexNumber } from "@/utils";

import Server1FilledIcon from "@/assets/icons/server-1-filled.svg";

export const revalidate = 30;

export default async function AddressStakingPage({
  params,
}: {
  params: Promise<{ network: string; addressId: string }>;
}) {
  const { addressId } = await params;

  await getNetworkFromParamsOrFail(params);

  if (isHexNumber(addressId, 128)) {
    throw redirect(
      `/address/${dag4.keyStore.getDagAddressFromPublicKey(addressId)}`
    );
  }

  if (!dag4.keyStore.validateDagAddress(addressId)) {
    throw notFound();
  }

  return (
    <DelegatedStakeProvider userAddress={addressId}>
      <PageTitle icon={<Server1FilledIcon className="size-8" />}>
        My Delegations
      </PageTitle>
      <PageLayout
        className="flex flex-col gap-10 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <DelegationsStats />
        <PendingLocksTable />
        <DelegationsTable />
      </PageLayout>
    </DelegatedStakeProvider>
  );
}
