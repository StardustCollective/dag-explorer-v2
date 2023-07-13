import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Snapshot } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { getL0Url } from '../../utils/networkUrls';

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = getL0Url(network); 
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
