import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { RewardTransaction, Snapshot, Transaction } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { getBEUrl } from '../../utils/networkUrls';


const getUrl = (metagraphId?: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = getBEUrl(network);
  return !metagraphId ? `${url}/global-snapshots` : `${url}/currency/${metagraphId}/snapshots`;
};

export const useGetLatestSnapshot = (metagraphId?: string) => {
  return useFetch<Snapshot>(getUrl(metagraphId) + '/latest');
};

export const useGetSnapshot = (hashOrOrdinal: string | number, metagraphId?: string) => {
  return useFetch<Snapshot>(getUrl(metagraphId) + '/' + hashOrOrdinal);
};

export const useGetAllSnapshots = (params?: any, refetchInterval?: number, metagraphId?: string) => {
  return useFetch<{ data: Snapshot[]; meta?: any }>(
    getUrl(metagraphId),
    params,
    { keepPreviousData: true, refetchInterval: refetchInterval },
    false
  );
};

export const useGetLatestSnapshotRewards = (metagraphId ?: string) => {
  return useFetch<RewardTransaction[]>(getUrl(metagraphId) + '/latest/rewards');
};

export const useGetSnapshotRewards = (hashOrOrdinal: string | number, metagraphId ?: string) => {
  return useFetch<RewardTransaction[]>(getUrl(metagraphId) + '/' + hashOrOrdinal + '/rewards');
};

export const useGetLatestSnapshotTransactions = (metagraphId ?: string) => {
  return useFetch<Transaction[]>(getUrl(metagraphId) + '/latest/transactions');
};

export const useGetSnapshotTransactions = (hashOrOrdinal: string | number, params?: any, metagraphId ?: string) => {
  return hashOrOrdinal
    ? useFetch<{ data: Transaction[]; meta: any }>(
        getUrl(metagraphId) + '/' + hashOrOrdinal + '/transactions',
        params,
        {
          keepPreviousData: true,
        },
        false
      )
    : null;
};
