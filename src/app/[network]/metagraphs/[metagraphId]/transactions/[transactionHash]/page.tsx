import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getNetworkFromParamsOrFail } from "@/common/network";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { TransactionDetail } from "@/components/TransactionDetail";
import { getMetagraphTransaction } from "@/queries";
import { shortenString } from "@/utils";

export const revalidate = 86_400; // 24 hours - These should not change, almost immutable

type ITransactionPageProps = {
  params: Promise<{
    network: string;
    metagraphId: string;
    transactionHash: string;
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

export default async function MetagraphTransactionPage({
  params,
}: ITransactionPageProps) {
  const { transactionHash, metagraphId } = await params;
  const network = await getNetworkFromParamsOrFail(params);

  const transaction = await getMetagraphTransaction(
    network,
    metagraphId,
    transactionHash
  );

  if (!transaction) {
    throw notFound();
  }

  return (
    <>
      <PageTitle>Transaction details</PageTitle>
      <PageLayout className="flex flex-col gap-4 px-4 lg:px-20 py-8" renderAs={"main"}>
        <TransactionDetail
          network={network}
          metagraphId={metagraphId}
          transaction={transaction}
        />
      </PageLayout>
    </>
  );
}
