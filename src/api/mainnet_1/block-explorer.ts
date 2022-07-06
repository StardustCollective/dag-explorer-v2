import { MainnetOneSnapshot, MainnetOneTransaction } from '../../types';
import { useFetch } from '../../utils/reactQuery';

const { REACT_APP_FIREBASE_REST, REACT_APP_MAINNET_ONE_BE } = process.env;

const URL = REACT_APP_FIREBASE_REST;

export const useGetLatestSnapshots = (query: string, refetchInterval?: number) =>
  useFetch<MainnetOneSnapshot[]>(URL + '/latest/snapshots.json' + query, undefined, {
    refetchInterval: refetchInterval,
  });

export const useGetLatestTransactions = (query: string, refetchInterval?: number) =>
  useFetch<MainnetOneTransaction[]>(URL + '/latest/transactions.json' + query, undefined, {
    refetchInterval: refetchInterval,
  });

export const useGetTransactionsBySnapshot = (hash: string) =>
  useFetch<MainnetOneTransaction[]>(REACT_APP_MAINNET_ONE_BE + '/snapshot/' + hash + '/transaction');

export const useGetTransactionsByAddress = (hash: string) =>
  useFetch<MainnetOneTransaction[]>(REACT_APP_MAINNET_ONE_BE + '/address/' + hash + '/transaction', { limit: 500 });

export const useGetTransaction = (hash: string) =>
  useFetch<MainnetOneTransaction>(REACT_APP_MAINNET_ONE_BE + '/transaction/' + hash);

export const useGetSnapshot = (hash: string) =>
  useFetch<MainnetOneSnapshot>(REACT_APP_MAINNET_ONE_BE + '/snapshot/' + hash);
