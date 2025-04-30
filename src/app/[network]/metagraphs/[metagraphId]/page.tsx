import { dag4 } from "@stardust-collective/dag4";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NodeLayerInfo } from "./components/NodeLayerInfo";
import { SnapshotsTable } from "./components/SnapshotsTable";
import { TransactionsTable } from "./components/TransactionsTable";

import { getNetworkFromParamsOrFail } from "@/common/network";
import { CopyAction } from "@/components/CopyAction";
import { MetagraphIcon } from "@/components/MetagraphIcon";
import { PageLayout } from "@/components/PageLayout";
import { PropertiesCard } from "@/components/PropertiesCard";
import { Section } from "@/components/Section";
import { Tab, Tabs } from "@/components/Tabs";
import { getMetagraph, getMetagraphNodes } from "@/queries";
import { INextTokenPaginationSearchParams } from "@/types";
import {
  
  getPageSearchParamsOrDefaults,
  
  parseNumberOrDefault,
  
  shortenString,
} from "@/utils";

import Brain2OutlineIcon from "@/assets/icons/brain-2-outline.svg";
import WalletIcon from "@/assets/icons/wallet.svg";

export const revalidate = 30;

export default async function MetagraphPage({
  params,
  searchParams,
}: {
  params: Promise<{ network: string; metagraphId: string }>;
  searchParams: Promise<{ section?: string } & INextTokenPaginationSearchParams>;
}) {
  const { metagraphId } = await params;

  const [{section, limit}, nextSearchParams] = await getPageSearchParamsOrDefaults(searchParams, {
    section: "snapshots",
    limit: "10",
  });


  const network = await getNetworkFromParamsOrFail(params);

  if (!dag4.keyStore.validateDagAddress(metagraphId)) {
    throw notFound();
  }

  const metagraph = await getMetagraph(network, metagraphId);
  const nodes = getMetagraphNodes(network, metagraphId);

  if (!metagraph) {
    throw notFound();
  }


  return (
    <PageLayout
      className="flex flex-col gap-4 px-4 lg:px-20 py-8"
      renderAs={"main"}
    >
      <Section className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex flex-col gap-2">
                <h3 className="flex items-center gap-3 text-hgtp-blue-950 font-semibold text-3xl justify-center lg:justify-start">
                  <MetagraphIcon
                    network={network}
                    metagraphId={metagraphId}
                    size={8}
                  />{" "}
                  {metagraph.name}
                </h3>
                <p className="max-w-[700px] text-center lg:text-left">{metagraph.description}</p>
              </div>
            </div>
            <PropertiesCard
              rows={[
                {
                  label: (
                    <span className="flex items-center gap-2 text-hgtp-blue-950">
                      <Brain2OutlineIcon className="text-black/65 size-5 shrink-0" />{" "}
                      Metagraph ID
                    </span>
                  ),
                  value: (
                    <span className="flex items-center gap-1">
                      <Link
                        href={`/address/${metagraph.id}`}
                        className="text-hgtp-blue-600"
                      >
                        {shortenString(metagraph.id, 4, 4)}
                      </Link>
                      <CopyAction value={metagraph.id} />
                    </span>
                  ),
                },
                {
                  label: (
                    <span className="flex items-center gap-2 text-hgtp-blue-950">
                      <WalletIcon className="text-black/65 size-5 shrink-0" />{" "}
                      Staking
                    </span>
                  ),
                  value: metagraph.stakingWalletAddress ? (
                    <span className="flex items-center gap-1">
                      <Link
                        href={`/address/${metagraph.stakingWalletAddress}`}
                        className="text-hgtp-blue-600"
                      >
                        {shortenString(metagraph.stakingWalletAddress, 4, 4)}
                      </Link>
                      <CopyAction value={metagraph.stakingWalletAddress} />
                    </span>
                  ) : (
                    ""
                  ),
                },
                {
                  label: (
                    <span className="flex items-center gap-2 text-hgtp-blue-950">
                      <WalletIcon className="text-black/65 size-5 shrink-0" />{" "}
                      Snapshot fees
                    </span>
                  ),
                  value: metagraph.feesWalletAddress ? (
                    <span className="flex items-center gap-1">
                      <Link
                        href={`/address/${metagraph.feesWalletAddress}`}
                        className="text-hgtp-blue-600"
                      >
                        {shortenString(metagraph.feesWalletAddress, 4, 4)}
                      </Link>
                      <CopyAction value={metagraph.feesWalletAddress} />
                    </span>
                  ) : (
                    ""
                  ),
                },
              ]}
            />
          </div>
          <div className="border-t border-black/25"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <NodeLayerInfo
              type="l0"
              layerInfo={nodes.then((nodes) => nodes?.l0)}
            />
            <NodeLayerInfo
              type="cl1"
              layerInfo={nodes.then((nodes) => nodes?.cl1)}
            />
            <NodeLayerInfo
              type="dl1"
              layerInfo={nodes.then((nodes) => nodes?.dl1)}
            />
          </div>
        </div>
        <div className="card flex flex-col w-full">
          <Tabs value={section ?? "transactions"}>
            <Tab
              id="snapshots"
              renderAs={Link}
              href={`/metagraphs/${metagraphId}?${nextSearchParams({
                section: "",
              })}`}
            >
              Snapshots
            </Tab>
            <Tab
              id="transactions"
              renderAs={Link}
              href={`/metagraphs/${metagraphId}?${nextSearchParams({
                section: "transactions",
              })}`}
            >
              Transactions
            </Tab>
          </Tabs>
          <div className="flex lg:p-0 px-4 pt-4">
            {section === "snapshots" && (
              <SnapshotsTable
                network={network}
                metagraphId={metagraphId}
                limit={parseNumberOrDefault(limit, 10)}
              />
            )}
            {section === "transactions" && (
              <TransactionsTable
                network={network}
                metagraphId={metagraphId}
                limit={parseNumberOrDefault(limit, 10)}
              />
            )}
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
