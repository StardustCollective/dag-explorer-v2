import { useContext } from 'react';
import { Balance, Transaction } from '../../types';
import { useFetch } from '../../utils/reactQuery';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { Network } from '../../constants';

const { REACT_APP_TESTNET_BE_URL, REACT_APP_MAINNET_TWO_BE_URL, REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = network === 'mainnet' ? REACT_APP_MAINNET_TWO_BE_URL : REACT_APP_TESTNET_BE_URL;
  return `${url}/addresses`;
};

export const useGetAddressTransactions = (address: string, params?: any) => {
  return useFetch<Transaction[]>(getUrl() + '/' + address + '/transactions', params, {
    keepPreviousData: true,
    retry: false,
  });
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
