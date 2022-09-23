import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Snapshot } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { 
  REACT_APP_TESTNET_L0_NODE_URL,
  REACT_APP_MAINNET_TWO_L0_NODE_URL 
} = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = network === 'mainnet' ? REACT_APP_MAINNET_TWO_L0_NODE_URL : REACT_APP_TESTNET_L0_NODE_URL; 
  return `${url}/global-snapshot`;
}

//returns binary file
export const useGetLatestSnapshot = () => {
  return useFetch<Snapshot>(getUrl() + '/latest');
} 

//returns { value: 123 }
export const useGetLatestSnapshotOrdinal = () => {
  return useFetch<{ value: number }>(getUrl() + '/latest/ordinal');
}

//returns binary file
export const useGetSnapshot = (ordinal: number) => {
  return useFetch<Snapshot>(getUrl() + '/' + ordinal);
}
