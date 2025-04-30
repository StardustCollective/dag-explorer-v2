import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getNetworkFromParamsOrFail } from "@/common/network";
import { ActionDetail } from "@/components/ActionDetail";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { getActionTransaction } from "@/queries/actions";
import { isActionTransactionType } from "@/types";
import { shortenString } from "@/utils";

export const revalidate = 86_400; // 24 hours - These should not change, almost immutable

type ITransactionPageProps = {
  params: Promise<{
    network: string;
    transactionHash: string;
    transactionType: string;
  }>;
};

export async function generateMetadata({
  params,
}: ITransactionPageProps): Promise<Metadata> {
  const { transactionHash } = await params;

  return {
    title: `Txn ${shortenString(transactionHash)} - DAG Explorer`,
    description: `Txn Details ${transactionHash} - DAG Explorer`,
  };
}

export default async function ActionTransactionPage({
  params,
}: ITransactionPageProps) {
  const { transactionHash, transactionType } = await params;
  const network = await getNetworkFromParamsOrFail(params);

  if (!isActionTransactionType(transactionType)) {
    throw notFound();
  }

  const transaction = await getActionTransaction(
    network,
    transactionHash,
    transactionType
  );

  if (!transaction) {
    throw notFound();
  }

  return (
    <>
      <PageTitle>Transaction details</PageTitle>
      <PageLayout
        className="flex flex-col gap-4 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <ActionDetail network={network} action={transaction} />
      </PageLayout>
    </>
  );
}
