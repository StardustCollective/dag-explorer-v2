import { MainnetOneSnapshot, MainnetOneTransaction } from '../../types';
import { useFetch } from '../../utils/reactQuery';

const { REACT_APP_MAINNET_ONE_FIREBASE_URL, REACT_APP_MAINNET_ONE_BE_URL } = process.env;

export const useGetLatestSnapshots = (query: string, refetchInterval?: number) =>
  useFetch<MainnetOneSnapshot[]>(REACT_APP_MAINNET_ONE_FIREBASE_URL + '/latest/snapshots.json' + query, undefined, {
    refetchInterval: refetchInterval,
  });

export const useGetLatestTransactions = (query: string, refetchInterval?: number) =>
  useFetch<MainnetOneTransaction[]>(REACT_APP_MAINNET_ONE_FIREBASE_URL + '/latest/transactions.json' + query, undefined, {
    refetchInterval: refetchInterval,
  });

export const useGetTransactionsBySnapshot = (hash: string) =>
  useFetch<MainnetOneTransaction[]>(REACT_APP_MAINNET_ONE_BE_URL + '/snapshot/' + hash + '/transaction');

export const useGetTransactionsByAddress = (hash: string) =>
  useFetch<MainnetOneTransaction[]>(REACT_APP_MAINNET_ONE_BE_URL + '/address/' + hash + '/transaction', { limit: 500 });

export const useGetTransaction = (hash: string) =>
  useFetch<MainnetOneTransaction>(REACT_APP_MAINNET_ONE_BE_URL + '/transaction/' + hash);

export const useGetSnapshot = (hash: string) =>
  useFetch<MainnetOneSnapshot>(REACT_APP_MAINNET_ONE_BE_URL + '/snapshot/' + hash);
