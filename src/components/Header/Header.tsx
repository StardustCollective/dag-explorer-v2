"use client";

import Link from "next/link";
import { useState } from "react";

import { MenuCard } from "../MenuCard";
import { PageLayout } from "../PageLayout";

import { HgtpNetwork, NetworkNames } from "@/common/consts/network";
import { getNetworkUrl } from "@/common/network";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletProvider } from "@/providers/WalletProvider";
import { shortenString } from "@/utils";

import Brain2Icon from "@/assets/icons/brain-2.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import CoinsRemoveIcon from "@/assets/icons/coins-remove.svg";
import PeopleCircleIcon from "@/assets/icons/people-circle.svg";
import Server1Icon from "@/assets/icons/server-1.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import ConstellationIcon from "@/assets/logos/constellation.svg";

export type IHeaderProps = Record<string, never>;

export const Header = ({}: IHeaderProps) => {
  const { wallet } = useWalletProvider();
  const network = useNetworkContext();

  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  return (
    <PageLayout
      className={{
        wrapper: "bg-hgtp-blue-600",
        children:
          "flex justify-between items-center h-20 px-20 text-white font-medium",
      }}
    >
      <Link
        className="flex gap-2.5 font-twk-laus font-medium text-2xl"
        href="/"
      >
        <ConstellationIcon className="size-7.5" />
        DAG Explorer
      </Link>
      <div className="flex gap-4">
        <Link className="flex gap-2 items-center h-9 px-4.5" href="/metagraphs">
          Metagraphs
          <Brain2Icon className="size-5" />
        </Link>
        <Link className="flex gap-2 items-center h-9 px-4.5" href="/staking">
          Delegated staking
          <Server1Icon className="size-5" />
        </Link>
      </div>
      <div className="flex gap-4 relative">
        <button
          className="button secondary outlined sm font-medium bg-transparent flex gap-1.5 items-center"
          onClick={() => setNetworkDropdownOpen((s) => !s)}
        >
          {NetworkNames[network ?? HgtpNetwork.MAINNET]}
          {networkDropdownOpen ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </button>
        {networkDropdownOpen && (
          <MenuCard
            className="absolute top-full left-0 mt-2.5 w-fit z-10"
            onClickOutside={() => setNetworkDropdownOpen(false)}
          >
            {Object.entries(NetworkNames).map(([network, name]) => (
              <MenuCard.Option
                key={network}
                renderAs={Link}
                href={getNetworkUrl(
                  network as HgtpNetwork,
                  window.location.href
                )}
              >
                {name}
              </MenuCard.Option>
            ))}
          </MenuCard>
        )}
        {!wallet.active && (
          <button
            className="button primary sm flex gap-1.5 items-center"
            onClick={() => wallet.activate()}
          >
            <WalletIcon className="size-4" />
            Connect wallet
          </button>
        )}
        {wallet.active && (
          <button
            className="button secondary outlined sm font-medium bg-transparent flex gap-1.5 items-center"
            onClick={() => setWalletDropdownOpen((s) => !s)}
          >
            <WalletIcon className="size-4" />
            {shortenString(wallet.account)}
            {walletDropdownOpen ? (
              <ChevronUpIcon className="size-4" />
            ) : (
              <ChevronDownIcon className="size-4" />
            )}
          </button>
        )}
        {wallet.active && walletDropdownOpen && (
          <MenuCard
            className="absolute top-full right-0 mt-2.5 w-[244px] z-10"
            onClickOutside={() => setWalletDropdownOpen(false)}
            afterContent={
              <button
                className="button primary outlined sm font-medium bg-transparent"
                onClick={() => wallet.deactivate()}
              >
                Disconnect wallet
              </button>
            }
          >
            <MenuCard.Option
              renderAs={Link}
              href={`/address/${wallet.account}`}
            >
              <PeopleCircleIcon className="size-6" />
              Address details
            </MenuCard.Option>
            <MenuCard.Option
              renderAs={Link}
              href={`/address/${wallet.account}/delegations`}
            >
              <CoinsRemoveIcon className="size-6" />
              My delegations
            </MenuCard.Option>
          </MenuCard>
        )}
      </div>
    </PageLayout>
  );
};
