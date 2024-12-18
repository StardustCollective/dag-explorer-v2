import React, { useContext, useEffect, createContext, useState } from 'react';
import { AppStage, HgtpNetwork, isAppStage, NetworkVersion } from '../constants';
import { getNetworkContextFromDomain, getNetworkContextFromLocation } from '../utils/network';

export type INetworkContext = {
  network: HgtpNetwork;
  networkVersion: NetworkVersion;
  changeNetwork: (network: HgtpNetwork) => void;
};

export const NetworkContext = createContext<INetworkContext | null>(null);

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [network, setNetwork] = useState<HgtpNetwork>(HgtpNetwork.MAINNET);
  const [networkVersion, setNetworkVersion] = useState<NetworkVersion>('2.0');

  const changeNetwork = (network: HgtpNetwork, stage?: AppStage) => {
    const prevOriginURL = new URL(location.href);
    const nextOriginURL = new URL(prevOriginURL);

    const currentNetworkContext = getNetworkContextFromDomain(prevOriginURL.hostname);

    stage =
      stage ??
      (currentNetworkContext.stage ||
        (isAppStage(process.env.REACT_APP_ENVIRONMENT) ? process.env.REACT_APP_ENVIRONMENT : AppStage.LOCAL));

    nextOriginURL.hostname =
      [network, stage === AppStage.PRODUCTION ? null : stage].filter((element) => element !== null).join('-') +
      '.' +
      currentNetworkContext.baseDomain;

    if (prevOriginURL.origin !== nextOriginURL.origin) {
      location.href = nextOriginURL.href;
    }

    setNetwork(network);
    setNetworkVersion(network === HgtpNetwork.MAINNET_1 ? '1.0' : '2.0');
  };

  useEffect(() => {
    const stage = isAppStage(process.env.REACT_APP_ENVIRONMENT) ? process.env.REACT_APP_ENVIRONMENT : AppStage.LOCAL;
    const networkContext = getNetworkContextFromLocation();

    changeNetwork(networkContext.network || HgtpNetwork.MAINNET, networkContext.stage || stage);
  }, []);

  return (
    <NetworkContext.Provider value={{ network, networkVersion, changeNetwork }}>{children}</NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);

  if (!ctx) {
    throw new Error('useNetwork() must be called inside a <NetworkProvider/> tree');
  }

  return ctx;
};
