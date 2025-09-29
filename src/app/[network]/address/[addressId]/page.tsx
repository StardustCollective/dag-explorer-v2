import { MiddleTruncate } from "@re-dev/react-truncate";
import { dag4 } from "@stardust-collective/dag4";
import clsx from "clsx";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ActionsTable } from "./components/ActionsTable";
import { ActiveLocksTable } from "./components/ActiveLocksTable";
import { ExportModalButton } from "./components/ExportModalButton";
import { MetagraphSelect } from "./components/MetagraphSelect";
import { RewardsTable } from "./components/RewardsTable";
import { TransactionsTable } from "./components/TransactionsTable";

import { HgtpNetwork } from "@/common/consts";
import { datumToDag } from "@/common/currencies";
import { getNetworkFromParamsOrFail } from "@/common/network";
import { CopyAction } from "@/components/CopyAction";
import { EmptyState } from "@/components/EmptyState";
import { FormatCurrency } from "@/components/FormatCurrency";
import { FormatCurrencyPrice } from "@/components/FormatCurrencyPrice";
import { MetagraphIcon } from "@/components/MetagraphIcon";
import { NetworksOnly } from "@/components/NetworksOnly";
import { PageLayout } from "@/components/PageLayout";
import { PageTitle } from "@/components/PageTitle";
import { Section } from "@/components/Section";
import { SkeletonSpan } from "@/components/SkeletonSpan";
import { SuspenseValue } from "@/components/SuspenseValue";
import { Table } from "@/components/Table";
import { Tab, Tabs } from "@/components/Tabs";
import {
  getAddressBalance,
  getAddressLockedBalance,
  getAddressMetagraphs,
  getMetagraphCurrencySymbol,
} from "@/queries";
import {
  IAPIAddressMetagraph,
  INextTokenPaginationSearchParams,
} from "@/types";
import {
  decodeDecimal,
  getPageSearchParamsOrDefaults,
  isHexNumber,
  parseNumberOrDefault,
  shortenString,
  withSearchParamsAsyncBoundary,
} from "@/utils";

import PeopleCircleFilledIcon from "@/assets/icons/people-circle-filled.svg";

type IAddressPageProps = {
  params: Promise<{ network: string; addressId: string }>;
  searchParams: Promise<
    {
      section?: string;
      metagraphId?: string;
    } & INextTokenPaginationSearchParams
  >;
};

export const revalidate = 30;

export async function generateMetadata({
  params,
}: IAddressPageProps): Promise<Metadata> {
  const { addressId } = await params;

  return {
    title: `Address ${shortenString(addressId)} - DAG Explorer`,
    description: `Address Details ${addressId} - DAG Explorer`,
  };
}

export default withSearchParamsAsyncBoundary(async function AddressPage({
  params,
  searchParams,
}: IAddressPageProps) {
  const { addressId } = await params;

  const [{ section, metagraphId, limit }, nextSearchParams] =
    await getPageSearchParamsOrDefaults(searchParams, {
      section: "transactions",
      metagraphId: "",
      limit: "10",
    });

  const network = await getNetworkFromParamsOrFail(params);

  if (isHexNumber(addressId, 128)) {
    throw redirect(
      `/address/${dag4.keyStore.getDagAddressFromPublicKey(addressId)}`
    );
  }

  if (!dag4.keyStore.validateDagAddress(addressId)) {
    throw notFound();
  }

  const balance = getAddressBalance(network, addressId, metagraphId);

  const addressMetagraphs = await getAddressMetagraphs(network, addressId);

  const currencySymbol = getMetagraphCurrencySymbol(network, metagraphId);

  return (
    <>
      <PageTitle
        icon={<PeopleCircleFilledIcon className="size-8 shrink-0" />}
        rightContent={
          <MetagraphSelect
            address={addressId}
            network={network}
            metagraphId={metagraphId}
            metagraphs={addressMetagraphs}
          />
        }
      >
        Address details
      </PageTitle>
      <PageLayout
        className="flex flex-col gap-4 px-4 lg:px-20 py-8"
        renderAs={"main"}
      >
        <Section className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card shadow-sm flex flex-col gap-4 p-6">
              <span className="text-hgtp-blue-900 font-medium text-xl">
                DAG Address
              </span>
              <span
                className={clsx(
                  "flex items-center gap-1",
                  "text-hgtp-blue-600 font-medium text-lg"
                )}
              >
                <MiddleTruncate end={15}>{addressId}</MiddleTruncate>
                <CopyAction value={addressId} />
              </span>
            </div>
            <div className="card shadow-sm flex flex-col gap-4 p-6">
              <span className="text-hgtp-blue-900 font-medium text-xl">
                Available <SuspenseValue value={currencySymbol} fallback="--" />{" "}
                balance
              </span>
              <span className="text-hgtp-blue-950 text-lg">
                <FormatCurrency
                  currency={currencySymbol}
                  value={balance.then((balance) => datumToDag(balance))}
                />{" "}
                <FormatCurrencyPrice
                  className="text-gray-500"
                  network={network}
                  currencyId={metagraphId || undefined}
                  value={balance.then((balance) => datumToDag(balance))}
                />
              </span>
            </div>
          </div>
          <Table.Suspense
            className="w-full [&_td]:text-sm"
            header={
              <div className="flex gap-2 px-5 py-3.5 text-xl font-medium">
                Tokens
              </div>
            }
            data={[
              {
                metagraphId: "native",
                name: "DAG",
                symbol: "DAG",
                iconUrl: null,
              } satisfies IAPIAddressMetagraph,
              ...addressMetagraphs,
            ].map((r) => ({
              ...r,
              balance: getAddressBalance(
                network,
                addressId,
                r.metagraphId === "native" ? undefined : r.metagraphId
              ),
              lockedAmount: getAddressLockedBalance(
                network,
                addressId,
                r.metagraphId === "native" ? undefined : r.metagraphId
              ),
              totalAmount: 0,
            }))}
            primaryKey="metagraphId"
            titles={{
              name: "Token",
              symbol: "Symbol",
              lockedAmount: "Locked balance",
              balance: "Available balance",
              totalAmount: "Total balance",
            }}
            loadingData={SkeletonSpan.generateTableRecords(3, [
              "name",
              "symbol",
              "lockedAmount",
              "balance",
              "totalAmount",
            ])}
            emptyState={<EmptyState label="No tokens detected" />}
            format={{
              name: (value, record) => (
                <Link
                  href={
                    record.metagraphId === "native"
                      ? `#`
                      : `/metagraphs/${record.metagraphId}`
                  }
                  className="flex items-center gap-2 text-hgtp-blue-600"
                >
                  <MetagraphIcon
                    network={network}
                    iconUrl={record.iconUrl}
                    size={6}
                  />
                  {value}
                </Link>
              ),
              balance: (value, record) => (
                <FormatCurrency
                  currency={record.symbol}
                  value={record.balance.then((v) => datumToDag(v))}
                />
              ),
              lockedAmount: (value, record) => (
                <FormatCurrency
                  currency={record.symbol}
                  value={value.then((value) => datumToDag(value))}
                />
              ),
              totalAmount: (value, record) => (
                <FormatCurrency
                  currency={record.symbol}
                  value={record.balance.then(async (v) =>
                    datumToDag(decodeDecimal(v).plus(await record.lockedAmount))
                  )}
                />
              ),
            }}
          />
          <div key={section} className="card shadow-sm flex flex-col w-full">
            <div className="flex flex-nowrap items-center">
              <Tabs value={section!}>
                <Tab
                  id="transactions"
                  renderAs={Link}
                  shallow={true}
                  href={`/address/${addressId}?${nextSearchParams({
                    section: "",
                  })}`}
                >
                  <SuspenseValue value={currencySymbol} fallback="DAG" />{" "}
                  Transactions
                </Tab>
                <Tab
                  id="rewards"
                  renderAs={Link}
                  shallow={true}
                  href={`/address/${addressId}?${nextSearchParams({
                    section: "rewards",
                  })}`}
                >
                  <SuspenseValue value={currencySymbol} fallback="DAG" />{" "}
                  Rewards
                </Tab>
                <NetworksOnly
                  network={network}
                  exceptOn={[HgtpNetwork.MAINNET_1]}
                >
                  <Tab
                    id="actions"
                    renderAs={Link}
                    shallow={true}
                    href={`/address/${addressId}?${nextSearchParams({
                      section: "actions",
                    })}`}
                  >
                    Actions
                  </Tab>
                  <Tab
                    id="locks"
                    renderAs={Link}
                    shallow={true}
                    href={`/address/${addressId}?${nextSearchParams({
                      section: "locks",
                    })}`}
                  >
                    Active Locks
                  </Tab>
                </NetworksOnly>
              </Tabs>
              <ExportModalButton
                addressId={addressId}
                metagraphId={metagraphId}
              />
            </div>
            <div className="flex lg:p-0 px-4 pt-4">
              {section === "transactions" && (
                <TransactionsTable
                  network={network}
                  addressId={addressId}
                  metagraphId={metagraphId}
                  limit={parseNumberOrDefault(limit, 10)}
                />
              )}
              <NetworksOnly
                network={network}
                exceptOn={[HgtpNetwork.MAINNET_1]}
              >
                {section === "rewards" && (
                  <RewardsTable
                    network={network}
                    addressId={addressId}
                    metagraphId={metagraphId}
                    limit={parseNumberOrDefault(limit, 10)}
                  />
                )}
              </NetworksOnly>
              <NetworksOnly
                network={network}
                exceptOn={[HgtpNetwork.MAINNET_1]}
              >
                {section === "actions" && (
                  <ActionsTable
                    network={network}
                    addressId={addressId}
                    metagraphId={metagraphId}
                    limit={parseNumberOrDefault(limit, 10)}
                  />
                )}
              </NetworksOnly>
              <NetworksOnly
                network={network}
                exceptOn={[HgtpNetwork.MAINNET_1]}
              >
                {section === "locks" && (
                  <ActiveLocksTable
                    network={network}
                    addressId={addressId}
                    metagraphId={metagraphId}
                    limit={parseNumberOrDefault(limit, 10)}
                  />
                )}
              </NetworksOnly>
            </div>
          </div>
        </Section>
      </PageLayout>
    </>
  );
});
