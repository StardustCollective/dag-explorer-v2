"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import { HgtpNetwork, NetworkNames } from "@/common/consts/network";
import { getNetworkUrl } from "@/common/network";
import { MenuCard, MenuCardOption } from "@/components/MenuCard";
import { NetworksOnly } from "@/components/NetworksOnly";
import { useNetworkContext } from "@/providers/NetworkProvider";

import Brain2OutlineIcon from "@/assets/icons/brain-2-outline.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg";
import CloseIcon from "@/assets/icons/close.svg";
import ListIcon from "@/assets/icons/list.svg";
import ServerOutline1Icon from "@/assets/icons/server-1-outline.svg";

export type IMobileMenuProps = { className?: string };

export const MobileMenu = ({ className }: IMobileMenuProps) => {
  const network = useNetworkContext();

  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        className={clsx("flex justify-center items-center", className)}
        onClick={() => setMenuOpen(true)}
      >
        <ListIcon className="size-6 shrink-0 text-white" />
      </button>
      <div
        className={clsx(
          "transition-all duration-500",
          "modal",
          !menuOpen && "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={clsx(
            "transform transition-all duration-500",
            "absolute top-0 right-0 h-dvh w-[310px] bg-hgtp-blue-600",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <button
            className="flex justify-end items-center p-4"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon className="size-8 shrink-0 text-white" />
          </button>
          <div className="flex flex-col gap-4 p-4">
            <div className="flex gap-4 relative">
              <button
                className="button secondary outlined sm font-medium bg-transparent flex gap-1.5 items-center w-full"
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
                  className="absolute top-full left-0 mt-2.5 w-full z-10"
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
                      onClick={() => {
                        setNetworkDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {name}
                    </MenuCardOption>
                  ))}
                </MenuCard>
              )}
            </div>
            <NetworksOnly network={network} exceptOn={[HgtpNetwork.MAINNET_1]}>
              <Link
                className="flex gap-2 justify-between items-center h-9 px-4.5 w-full"
                href="/metagraphs"
                onClick={() => setMenuOpen(false)}
              >
                Metagraphs
                <Brain2OutlineIcon className="size-5 shrink-0" />
              </Link>
            </NetworksOnly>
            <NetworksOnly
              network={network}
              exceptOn={[HgtpNetwork.MAINNET_1, HgtpNetwork.MAINNET]}
            >
              <Link
                className="flex gap-2 justify-between items-center h-9 px-4.5 w-full"
                href="/staking"
                onClick={() => setMenuOpen(false)}
              >
                Delegated staking
                <ServerOutline1Icon className="size-5 shrink-0" />
              </Link>
            </NetworksOnly>
          </div>
        </div>
      </div>
    </>
  );
};
