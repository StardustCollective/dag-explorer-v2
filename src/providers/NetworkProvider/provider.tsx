"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { HgtpNetwork } from "@/common/consts";
import { getNetworkFromHostname } from "@/common/network";

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
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [network, setNetwork] = useState<HgtpNetwork>(HgtpNetwork.MAINNET);
  const pathname = usePathname();

  const setNetworkFromHostname = () => {
    const network = getNetworkFromHostname(
      globalThis?.window?.location?.hostname ?? ""
    );

    network && setNetwork(network);
  };

  useEffect(() => {
    setNetworkFromHostname();
  }, [pathname]);

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
