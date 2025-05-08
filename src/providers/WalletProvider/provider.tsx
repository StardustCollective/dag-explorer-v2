"use client";

import { createWalletStore } from "./state";

import { buildZustandProviderAndHook } from "@/utils/zustand_provider";

const [WalletProvider, useWalletStore] = buildZustandProviderAndHook(
  "Wallet",
  createWalletStore
);

export { WalletProvider, useWalletStore };
