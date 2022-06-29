import { useFetch } from '../../utils/reactQuery';
import { RewardTransaction, Snapshot, Transaction } from '../../types';

const { REACT_APP_TESTNET_BLOCK_EXPLORER_URL } = process.env;

const URL = REACT_APP_TESTNET_BLOCK_EXPLORER_URL + '/global-snapshots';

export const useGetLatestSnapshot = () => useFetch<Snapshot>(URL + '/latest');

export const useGetSnapshot = (hashOrOrdinal: string | number) => {
  return useFetch<Snapshot>(URL + '/' + hashOrOrdinal);
};

export const useGetAllSnapshots = (params?: any) => {
  return useFetch<Snapshot[]>(URL, params, { keepPreviousData: true });
};

export const useGetLatestSnapshotRewards = () => useFetch<RewardTransaction[]>(URL + '/latest/rewards');

export const useGetSnapshotRewards = (hashOrOrdinal: string | number) =>
  useFetch<RewardTransaction[]>(URL + '/' + hashOrOrdinal + '/rewards');

export const useGetLatestSnapshotTransactions = () => useFetch<Transaction[]>(URL + '/latest/transactions');

export const useGetSnapshotTransactions = (hashOrOrdinal: string | number, params?: any) =>
  hashOrOrdinal
    ? useFetch<Transaction[]>(URL + '/' + hashOrOrdinal + '/transactions', params, { keepPreviousData: true })
    : null;
