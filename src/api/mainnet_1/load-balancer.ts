import { Balance, Transaction } from '../types';
import { useFetch } from '../../utils/reactQuery';

const { REACT_APP_MAINNET_BE } = process.env;

const URL = REACT_APP_MAINNET_BE + '/addresses';

export const useGetAddressTransactions = (address: string, params?: any) =>
  useFetch<Transaction[]>(URL + '/' + address + '/transactions', params, { keepPreviousData: true });

export const useGetAddressSentTransactions = (address: string) =>
  useFetch<Transaction[]>(URL + '/' + address + '/transactions/sent');

//add limit, search_after and search_before
export const useGetAddressReceivedTransactions = (address: string) =>
  useFetch<Transaction[]>(URL + '/' + address + '/transactions/received');

export const useGetAddressBalance = (address: string) => useFetch<Balance>(URL + '/' + address + '/balances');
