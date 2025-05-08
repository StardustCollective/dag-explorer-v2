"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "zustand";

import { MenuCard, MenuCardOption } from "../MenuCard";
import { NavLink } from "../NavLink";
import { NetworksOnly } from "../NetworksOnly";
import { PageLayout } from "../PageLayout";

import { MobileMenu } from "./components/MobileMenu";

import { HgtpNetwork, NetworkNames } from "@/common/consts/network";
import { getNetworkUrl } from "@/common/network";
import { useNetworkContext } from "@/providers/NetworkProvider";
import { useWalletStore } from "@/providers/WalletProvider";
import { shortenString } from "@/utils";

import Brain2FilledIcon from "@/assets/icons/brain-2-filled.svg";
import Brain2OutlineIcon from "@/assets/icons/brain-2-outline.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import CoinsRemoveIcon from "@/assets/icons/coins-remove.svg";
import PeopleCircleOutlineIcon from "@/assets/icons/people-circle-outline.svg";
import ServerFilled1Icon from "@/assets/icons/server-1-filled.svg";
import ServerOutline1Icon from "@/assets/icons/server-1-outline.svg";
import WalletIcon from "@/assets/icons/wallet.svg";
import ConstellationIcon from "@/assets/logos/constellation.svg";

export type IHeaderProps = Record<string, never>;

export const Header = ({}: IHeaderProps) => {
  const { status, address, connect, disconnect } = useStore(
    useWalletStore(),
    (state) => state
  );
  const network = useNetworkContext();

  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  return (
    <PageLayout
      className={{
        wrapper: "bg-hgtp-blue-600",
        children:
          "flex justify-between items-center h-20 px-4 lg:px-20 text-white font-medium",
      }}
    >
      <Link
        className="flex gap-2.5 font-twk-laus font-medium text-2xl"
        href="/"
      >
        <ConstellationIcon className="size-7.5 shrink-0" />
        DAG Explorer
      </Link>
      <MobileMenu className="lg:hidden" />
      <div className="hidden lg:flex gap-4">
        <NetworksOnly network={network} exceptOn={[HgtpNetwork.MAINNET_1]}>
          <NavLink
            className="flex gap-2 items-center h-9 px-4.5"
            activeClassName="font-semibold"
            href="/metagraphs"
          >
            Metagraphs
            <NavLink.Content renderCondition={false}>
              <Brain2OutlineIcon className="size-5 shrink-0" />
            </NavLink.Content>
            <NavLink.Content renderCondition={true}>
              <Brain2FilledIcon className="size-5 shrink-0" />
            </NavLink.Content>
          </NavLink>
        </NetworksOnly>
        <NetworksOnly
          network={network}
          exceptOn={[HgtpNetwork.MAINNET_1, HgtpNetwork.MAINNET]}
        >
          <NavLink
            className="flex gap-2 items-center h-9 px-4.5"
            activeClassName="font-semibold"
            href="/staking"
          >
            Delegated Staking
            <NavLink.Content renderCondition={false}>
              <ServerOutline1Icon className="size-5 shrink-0" />
            </NavLink.Content>
            <NavLink.Content renderCondition={true}>
              <ServerFilled1Icon className="size-5 shrink-0" />
            </NavLink.Content>
          </NavLink>
        </NetworksOnly>
      </div>
      <div className="hidden lg:flex gap-4 relative">
        <button
          className="button secondary outlined sm font-medium bg-transparent flex gap-1.5 items-center"
          onClick={() => setNetworkDropdownOpen((s) => !s)}
        >
          {NetworkNames[network ?? HgtpNetwork.MAINNET]}
          {networkDropdownOpen ? (
            <ChevronUpIcon className="size-4 shrink-0" />
          ) : (
            <ChevronDownIcon className="size-4 shrink-0" />
          )}
        </button>
        {networkDropdownOpen && (
          <MenuCard
            className="absolute top-full left-0 mt-2.5 w-fit z-10"
            onClickOutside={() => setNetworkDropdownOpen(false)}
          >
            {Object.entries(NetworkNames).map(([network, name]) => (
              <MenuCardOption
                key={network}
                renderAs={Link}
                href={getNetworkUrl(
                  network as HgtpNetwork,
                  window.location.href
                )}
                onClick={() => setNetworkDropdownOpen(false)}
              >
                {name}
              </MenuCardOption>
            ))}
          </MenuCard>
        )}
        {status === "disconnected" && (
          <button
            className="button primary sm flex gap-1.5 items-center"
            onClick={connect}
          >
            <WalletIcon className="size-4 shrink-0" />
            Connect wallet
          </button>
        )}
        {status === "connected" && (
          <button
            className="button secondary outlined sm font-medium bg-transparent flex gap-1.5 items-center"
            onClick={() => setWalletDropdownOpen((s) => !s)}
          >
            <WalletIcon className="size-4 shrink-0" />
            {shortenString(address ?? "")}
            {walletDropdownOpen ? (
              <ChevronUpIcon className="size-4 shrink-0" />
            ) : (
              <ChevronDownIcon className="size-4 shrink-0" />
            )}
          </button>
        )}
        {status === "connected" && walletDropdownOpen && (
          <MenuCard
            className="absolute top-full right-0 mt-2.5 w-[244px] z-10"
            onClickOutside={() => setWalletDropdownOpen(false)}
            afterContent={
              <button
                className="button primary outlined sm font-medium bg-transparent"
                onClick={disconnect}
              >
                Disconnect wallet
              </button>
            }
          >
            <MenuCardOption
              renderAs={Link}
              href={`/address/${address}`}
              onClick={() => setWalletDropdownOpen(false)}
            >
              <PeopleCircleOutlineIcon className="size-6 shrink-0" />
              Address details
            </MenuCardOption>
            <MenuCardOption
              renderAs={Link}
              href={`/address/${address}/staking`}
              onClick={() => setWalletDropdownOpen(false)}
            >
              <CoinsRemoveIcon className="size-6 shrink-0" />
              My delegations
            </MenuCardOption>
          </MenuCard>
        )}
      </div>
    </PageLayout>
  );
};
