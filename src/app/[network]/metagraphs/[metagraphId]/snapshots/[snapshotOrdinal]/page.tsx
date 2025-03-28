import { notFound } from "next/navigation";

import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { SnapshotDetail } from "@/components/SnapshotDetail";
import { getSnapshot } from "@/queries";
import { parseNumberOrDefault } from "@/utils";

export const revalidate = 86_400; // 24 hours - These should not change, almost immutable

export default async function SnapshotPage({
  params,
  searchParams,
}: {
  params: Promise<{
    network: string;
    metagraphId: string;
    snapshotOrdinal: string;
  }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { metagraphId, snapshotOrdinal } = await params;
  const { section } = await searchParams;
  const network = await getNetworkFromParamsOrFail(params);

  const snapshot = await getSnapshot(
    network,
    parseNumberOrDefault(snapshotOrdinal, -1),
    metagraphId
  );

  if (!snapshot) {
    throw notFound();
  }

  return (
    <>
      <PageTitle>Snapshot details</PageTitle>
      <PageLayout className="flex flex-col gap-4 px-20 py-8" renderAs={"main"}>
        <SnapshotDetail
          section={section ?? "transactions"}
          network={network}
          snapshot={snapshot}
          metagraphId={metagraphId}
        />
      </PageLayout>
    </>
  );
}
