import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { RewardTransaction, Snapshot, Transaction } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { 
  REACT_APP_TESTNET_BE_URL,
  REACT_APP_MAINNET_TWO_BE_URL 
} = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = network === 'mainnet' ? REACT_APP_MAINNET_TWO_BE_URL : REACT_APP_TESTNET_BE_URL; 
  return `${url}/global-snapshots`; 
}

export const useGetLatestSnapshot = () => {
  return useFetch<Snapshot>(getUrl() + '/latest');
}

export const useGetSnapshot = (hashOrOrdinal: string | number) => {
  return useFetch<Snapshot>(getUrl() + '/' + hashOrOrdinal);
};

export const useGetAllSnapshots = (params?: any, refetchInterval?: number) => {
  return useFetch<Snapshot[]>(getUrl(), params, { keepPreviousData: true, refetchInterval: refetchInterval });
};

export const useGetLatestSnapshotRewards = () => {
  return useFetch<RewardTransaction[]>(getUrl() + '/latest/rewards');
}

export const useGetSnapshotRewards = (hashOrOrdinal: string | number) => {
  return useFetch<RewardTransaction[]>(getUrl() + '/' + hashOrOrdinal + '/rewards');
}
  
export const useGetLatestSnapshotTransactions = () => {
  return useFetch<Transaction[]>(getUrl() + '/latest/transactions');
}

export const useGetSnapshotTransactions = (hashOrOrdinal: string | number, params?: any) => {
  return hashOrOrdinal ? 
    useFetch<Transaction[]>(getUrl() + '/' + hashOrOrdinal + '/transactions', params, { keepPreviousData: true }) : 
    null;
}
  
