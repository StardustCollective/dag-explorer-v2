import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Transaction } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_TESTNET_BE_URL, REACT_APP_MAINNET_TWO_BE_URL } = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = network === 'mainnet' ? REACT_APP_MAINNET_TWO_BE_URL : REACT_APP_TESTNET_BE_URL;
  return `${url}/transactions`;
};

export const useGetTransaction = (hash: string) => {
  return useFetch<Transaction>(getUrl() + '/' + hash);
};

export const useGetAllTransactions = (params?: any, refetchInterval?: number) => {
  return useFetch<{ data: Transaction[]; meta?: any }>(
    getUrl(),
    params,
    {
      keepPreviousData: true,
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};
