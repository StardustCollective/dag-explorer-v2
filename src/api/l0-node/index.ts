import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Peer, ValidatorNode } from '../../types';
import { Network } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

export { useGetLatestSnapshot, useGetSnapshot, useGetLatestSnapshotOrdinal } from './global-snapshot';
export {
  useGetLatestSnapshotTotalDagSupply,
  useGetTotalDagSupplyBySnapshot,
  useGetDagBalanceForAddress,
  useGetDagBalanceForAddressOnSnapshot,
} from './dag';

const { 
  REACT_APP_TESTNET_L0_NODE_URL, 
  REACT_APP_MAINNET_TWO_L0_NODE_URL,
  REACT_APP_DAG_EXPLORER_API_URL
} = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return network === 'mainnet' ? REACT_APP_MAINNET_TWO_L0_NODE_URL : REACT_APP_TESTNET_L0_NODE_URL; 
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
  
