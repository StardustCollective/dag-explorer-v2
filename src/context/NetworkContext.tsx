import React from 'react';
import { createContext, useState } from 'react';
import { Network } from '../constants';

export type NetworkContextType = {
  network: Network;
  changeNetwork: (network: Network) => void;
};

export const NetworkContext = createContext<NetworkContextType | null>(null);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<Network>(null);

  const handleChange = (toNetwork: Network) => {
    const environment = process.env.REACT_APP_ENVIRONMENT;
    let switchToNetwork = toNetwork;
    if (environment === 'staging') {
      switchToNetwork += '-staging';
    }

    if (window.location.href === 'https://dagexplorer.io/') {
      window.location.href = 'https://' + switchToNetwork + '.dagexplorer.io/';
    }

    if (!window.location.href.includes(switchToNetwork) && window.location.href !== 'https://dagexplorer.io/') {
      let domain = window.location.href.split('.').slice(1);
      if (domain.length === 0 && window.location.href === 'http://localhost:3000/') {
        domain = ['localhost:3000'];
      }
      const navigateTo = (window.location.protocol + '//' + switchToNetwork + '.' + domain).replaceAll(',', '.');
      window.location.href = navigateTo;
    }
    setNetwork(toNetwork);
  };

  return (
    <NetworkContext.Provider value={{ network: network, changeNetwork: handleChange }}>
      {children}
    </NetworkContext.Provider>
  );
};
