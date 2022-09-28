import React from 'react';
import { createContext, useState } from 'react';
import { Network, NetworkVersion } from '../constants';

export type NetworkContextType = {
  network: Network;
  networkVersion: NetworkVersion;
  changeNetwork: (network: Network) => void;
};

export const NetworkContext = createContext<NetworkContextType | null>(null);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<Network>(null);
  const [networkVersion, setNetworkVersion] = useState<NetworkVersion>(null);

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
      if (domain.length === 0 && window.location.href.includes('http://localhost:')) {
        domain = [window.location.href.replace('http://', '')];
      }
      const navigateTo = (window.location.protocol + '//' + switchToNetwork + '.' + domain).replaceAll(',', '.');
      window.location.href = navigateTo;
    }
    setNetwork(toNetwork);

    if (toNetwork === 'mainnet1') {
      setNetworkVersion('1.0');
    } else {
      setNetworkVersion('2.0');
    }
  };

  return (
    <NetworkContext.Provider value={{ network: network, networkVersion: networkVersion, changeNetwork: handleChange }}>
      {children}
    </NetworkContext.Provider>
  );
};
