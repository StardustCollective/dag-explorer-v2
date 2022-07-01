import React, { useEffect } from 'react';
import { createContext, useState } from 'react';
import { useGetPrices } from '../api/coingecko';

export type PricesContextType = {
  dagInfo: any;
  btcInfo: any;
};

export const PricesContext = createContext<PricesContextType | null>(null);

export const PricesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dagInfo, setDagInfo] = useState<any>(null);
  const [btcInfo, setBtcInfo] = useState<any>(null);
  const pricesInfo = useGetPrices();
  useEffect(() => {
    if (!pricesInfo.isFetching && !pricesInfo.error) {
      setDagInfo(pricesInfo.data['constellation-labs']);
      setBtcInfo(pricesInfo.data['bitcoin']);
    }
  }, [pricesInfo.isFetching]);

  return <PricesContext.Provider value={{ dagInfo: dagInfo, btcInfo: btcInfo }}>{children}</PricesContext.Provider>;
};
