import React, { useEffect } from 'react';
import { createContext, useState } from 'react';
import { Network } from '../constants';
import { getLocalStorage } from '../utils/localStorage';

export type NetworkContextType = {
  network: Network;
  changeNetwork: (network: Network) => void;
};

export const NetworkContext = createContext<NetworkContextType | null>(null);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<Network>(() => getLocalStorage('network', 'testnet'));

  useEffect(() => {
    localStorage.setItem('network', network);
  }, [network]);

  return (
    <NetworkContext.Provider value={{ network: network, changeNetwork: setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};
