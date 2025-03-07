"use client";

import { useStargazerWallet } from "@stardust-collective/web3-react-stargazer-connector";
import { createContext, useContext } from "react";

import { getSignableDataPayload } from "./utils";

type IWalletProviderContext = {
  wallet: ReturnType<typeof useStargazerWallet>;
  requestDataSignature: (data: Record<string, any>) => Promise<{
    pub: string;
    pubExp: string;
    signature: string;
    payload: string;
  }>;
};

const WalletProviderContext = createContext<IWalletProviderContext | null>(
  null
);

export const WalletProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const wallet = useStargazerWallet();

  const requestDataSignature: IWalletProviderContext["requestDataSignature"] =
    async (data) => {
      if (!wallet.active) {
        throw new Error("Wallet is not active, cannot sign messages");
      }

      const payload = getSignableDataPayload(data);

      const signature = await wallet.request({
        method: "dag_signData",
        params: [wallet.account, payload],
      });

      let pub: string = await wallet.request({
        method: "dag_getPublicKey",
        params: [wallet.account],
      });

      pub = pub.length === 128 ? pub : pub.substring(2);

      return { pub, pubExp: "04" + pub, signature, payload };
    };

  return (
    <WalletProviderContext.Provider value={{ wallet, requestDataSignature }}>
      {children}
    </WalletProviderContext.Provider>
  );
};

export const useWalletProvider = () => {
  const ctx = useContext(WalletProviderContext);

  if (!ctx) {
    throw new Error(
      "useWalletProvider calls must be done under a <WalletProvider/> component"
    );
  }

  return ctx;
};
