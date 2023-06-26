import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { MetagraphTransactionResponse, Transaction } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_TESTNET_BE_URL, REACT_APP_MAINNET_TWO_BE_URL, REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = (metagraphId?: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = network === 'mainnet' ? REACT_APP_MAINNET_TWO_BE_URL : REACT_APP_TESTNET_BE_URL;
  return metagraphId ? `${url}/currency/${metagraphId}/transactions` : `${url}/transactions`;
};

export const useGetTransaction = (hash: string, metagraphId?: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  if (metagraphId) {
    const url = `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/metagraphs/${metagraphId}/transactions/${hash}`;
    return useFetch<MetagraphTransactionResponse>(url);
  }

  const url = `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/transactions/${hash}`;
  return useFetch<MetagraphTransactionResponse>(url);
};

export const useGetAllTransactions = (params?: any, refetchInterval?: number, metagraphId?: string) => {
  return useFetch<{ data: Transaction[]; meta?: any }>(
    getUrl(metagraphId),
    params,
    {
      keepPreviousData: true,
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};

export const useGetLatestTransactions = (params?: any, refetchInterval?: number) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/latest-transactions';
  return useFetch<{ data: Transaction[]; meta?: any }>(
    url,
    params,
    {
      keepPreviousData: true,
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};
