import { Balance, Transaction } from '../../types';
import { useFetch } from '../../utils/reactQuery';

const { REACT_APP_TESTNET_BLOCK_EXPLORER_URL } = process.env;

const URL = REACT_APP_TESTNET_BLOCK_EXPLORER_URL + '/addresses';

export const useGetAddressTransactions = (address: string, params?: any) =>
  useFetch<Transaction[]>(URL + '/' + address + '/transactions', params, { keepPreviousData: true });

export const useGetAddressSentTransactions = (address: string) =>
  useFetch<Transaction[]>(URL + '/' + address + '/transactions/sent');

export const useGetAddressReceivedTransactions = (address: string) =>
  useFetch<Transaction[]>(URL + '/' + address + '/transactions/received');

export const useGetAddressBalance = (address: string) => useFetch<Balance>(URL + '/' + address + '/balances');
