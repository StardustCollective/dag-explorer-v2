import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Peer, ValidatorNode } from '../../types';
import { Network } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { getL0Url } from '../../utils/networkUrls';

export { useGetLatestSnapshot, useGetSnapshot, useGetLatestSnapshotOrdinal } from './global-snapshot';
export {
  useGetLatestSnapshotTotalDagSupply,
  useGetTotalDagSupplyBySnapshot,
  useGetDagBalanceForAddress,
  useGetDagBalanceForAddressOnSnapshot,
} from './dag';

const { 
  REACT_APP_DAG_EXPLORER_API_URL
} = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return getL0Url(network);
}

export const useGetClusterInfo = () => {
  return useFetch<Peer[]>(getUrl() + '/cluster/info');
}

export const useGetMetric = () => {
  return useFetch<string>(getUrl() + '/metric');
}

export const useGetValidatorNodes = (network: Exclude<Network, 'mainnet1'>) => {
  return useFetch<ValidatorNode[]>(REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes');
}
  

export const useGetClusterRewards = (network: Exclude<Network, 'mainnet1'>) => {
  return useFetch<{ totalRewards: number }>(REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes/rewards');
}
  
