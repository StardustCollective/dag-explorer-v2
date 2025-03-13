"use client";

import Link from "next/link";
import { useState } from "react";

import { PageLayout } from "../PageLayout";
import { MenuCard } from "../MenuCard";

import { useWalletProvider } from "@/providers/WalletProvider";
import { shortenString } from "@/utils";

export type IHeaderProps = Record<string, never>;

export const Header = ({}: IHeaderProps) => {
  const { wallet } = useWalletProvider();
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

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
        DAG Explorer
      </Link>
      <div className="flex gap-4">
        <Link className="flex gap-2 items-center h-9 px-4.5" href="/metagraphs">
          Metagraphs
        </Link>
        <Link className="flex gap-2 items-center h-9 px-4.5" href="/staking">
          Delegated staking
        </Link>
      </div>
      <div className="flex gap-4 relative">
        <button className="button secondary outlined sm font-medium bg-transparent">
          Mainnet 2.0
        </button>
        {!wallet.active && (
          <button
            className="button primary sm"
            onClick={() => wallet.activate()}
          >
            Connect wallet
          </button>
        )}
        {wallet.active && (
          <button
            className="button secondary outlined sm font-medium bg-transparent"
            onClick={() => setWalletDropdownOpen((s) => !s)}
          >
            {shortenString(wallet.account)}
          </button>
        )}
        {wallet.active && walletDropdownOpen && (
          <MenuCard
            className="absolute top-full right-0 mt-2.5 w-[244px] z-10"
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
              Address details
            </MenuCard.Option>
            <MenuCard.Option
              renderAs={Link}
              href={`/address/${wallet.account}/delegations`}
            >
              My delegations
            </MenuCard.Option>
          </MenuCard>
        )}
      </div>
    </PageLayout>
  );
};
