import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { MetagraphInfo } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_TESTNET_BE_URL, REACT_APP_MAINNET_TWO_BE_URL } = process.env;

const getUrl = (address: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = network === 'mainnet' ? REACT_APP_MAINNET_TWO_BE_URL : REACT_APP_TESTNET_BE_URL;
  return `${url}/${address}`;
};

export const useGetAllMetagraphs = (address:string, params?: any, refetchInterval?: number) => {
  return useFetch<{ data: MetagraphInfo[]; meta?: any }>(
    getUrl(address),
    params,
    {
      keepPreviousData: true,
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};
