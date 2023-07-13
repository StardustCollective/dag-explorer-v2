import { useContext } from 'react';
import { Balance, Transaction } from '../../types';
import { useFetch } from '../../utils/reactQuery';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { Network } from '../../constants';
import { getBEUrl } from '../../utils/networkUrls';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = getBEUrl(network);
  return `${url}/addresses`;
};

const getMetagraphUrl = (metagraphId: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = getBEUrl(network);
  return `${url}/currency/${metagraphId}/addresses`;
};

export const useGetAddressTransactions = (address: string, metagraphId?: string, params?: any) => {
  const baseUrl = (!metagraphId || metagraphId === 'ALL_METAGRAPHS') ? getUrl() : getMetagraphUrl(metagraphId);
  return useFetch<{ data: Transaction[]; meta?: any }>(
    baseUrl + '/' + address + '/transactions',
    params,
    {
      retry: false,
    },
    false
  );
};

export const useGetAddressSentTransactions = (address: string) => {
  return useFetch<Transaction[]>(getUrl() + '/' + address + '/transactions/sent');
};

export const useGetAddressReceivedTransactions = (address: string) => {
  return useFetch<Transaction[]>(getUrl() + '/' + address + '/transactions/received');
};

export const useGetAddressBalance = (address: string) => {
  return useFetch<Balance>(getUrl() + '/' + address + '/balance');
};

export const useGetAddressTotalRewards = (address: string, network: Exclude<Network, 'mainnet1'>) => {
  return useFetch<{ totalAmount: number; isValidator: boolean }>(
    REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/addresses/' + address + '/rewards'
  );
};
