import { notFound } from "next/navigation";

import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { TransactionDetail } from "@/components/TransactionDetail/TransactionDetail";
import { getTransaction } from "@/queries";


export const revalidate = 86_400; // 24 hours - These should not change, almost immutable

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ network: string; transactionHash: string }>;
}) {
  const { transactionHash } = await params;
  const network = await getNetworkFromParamsOrFail(params);

  const transaction = await getTransaction(network, transactionHash);

  if (!transaction) {
    throw notFound();
  }

  return (
    <>
      <PageTitle>Transaction details</PageTitle>
      <PageLayout className="flex flex-col gap-4 px-20 py-8" renderAs={"main"}>
        <TransactionDetail network={network} transaction={transaction} />
      </PageLayout>
    </>
  );
}
