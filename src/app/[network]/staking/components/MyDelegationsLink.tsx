"use client";

import Link from "next/link";
import { useStore } from "zustand";

import { useWalletStore } from "@/providers/WalletProvider";

export type IMyDelegationsLinkProps = Record<string, never>;

export const MyDelegationsLink = ({}: IMyDelegationsLinkProps) => {
  const { status, address } = useStore(useWalletStore(),(state) => state);

  if (status !== "connected" || !address) {
    return null;
  }

  return (
    <Link
      href={`/address/${address}/staking`}
      className="text-hgtp-blue-600 text-lg"
    >
      View my delegations
    </Link>
  );
};
