"use client";

import { useStore } from "zustand";

import { DelegatedStakeProvider } from "@/features/delegated-stake/DelegatedStakeProvider";
import { useWalletStore } from "@/providers/WalletProvider";

export const ClientDelegatedStakeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const walletStore = useWalletStore();

  const walletStatus = useStore(walletStore, (state) => state.status);
  const walletAddress = useStore(walletStore, (state) => state.address);

  return (
    <DelegatedStakeProvider
      userAddress={
        walletStatus === "connected" ? walletAddress ?? "" : undefined
      }
    >
      {children}
    </DelegatedStakeProvider>
  );
};
