import React from 'react';
import { createContext, useState } from 'react';
import { Network } from '../constants';

export type NetworkContextType = {
  network: Network;
  changeNetwork: (network: Network) => void;
};

export const NetworkContext = createContext<NetworkContextType | null>(null);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<Network>('mainnet1');

  const handleChange = (toNetwork: Network) => {
    console.log('toNetwork', toNetwork);
    const environment = process.env.REACT_APP_ENVIRONMENT;
    console.log('env: ', environment); //staging
    let switchToNetwork = toNetwork;
    if (environment === 'staging') {
      switchToNetwork += '-staging';
    }
    console.log('switchTo: ', switchToNetwork); //mainnet1-staging ??
    if (!window.location.href.includes(switchToNetwork)) {
      let domain = window.location.href.split('.').slice(1);
      if (domain.length === 0 && window.location.href === 'http://localhost:3000/') {
        domain = ['localhost:3000'];
      }
      console.log('domain: ', domain);
      const navigateTo = (window.location.protocol + '//' + switchToNetwork + '.' + domain).replaceAll(',', '.');
      console.log('navTo: ', navigateTo);
      window.location.href = navigateTo;
    }
    console.log('setting: ', toNetwork);
    setNetwork(toNetwork);
  };

  return (
    <NetworkContext.Provider value={{ network: network, changeNetwork: handleChange }}>
      {children}
    </NetworkContext.Provider>
  );
};
