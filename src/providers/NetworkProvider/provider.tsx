"use client";

import { createContext, useContext } from "react";

import { HgtpNetwork } from "@/common/consts";

type INetworkProviderContext = {
  network: HgtpNetwork;
};

const NetworkProviderContext = createContext<INetworkProviderContext | null>(
  null
);

/**
 * To be used for client-side components only. When the current network is needed,
 * on server-side, use the @/common/network functions.
 */
export const NetworkProvider = ({
  network,
  children,
}: {
  network: HgtpNetwork;
  children?: React.ReactNode;
}) => {
  return (
    <NetworkProviderContext.Provider value={{ network }}>
      {children}
    </NetworkProviderContext.Provider>
  );
};

export const useNetworkContext = () => {
  const ctx = useContext(NetworkProviderContext);

  if (!ctx) {
    throw new Error(
      "useNetworkContext calls must be done under a <NetworkProvider/> component"
    );
  }

  return ctx.network;
};
