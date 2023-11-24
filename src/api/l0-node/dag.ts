import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Balance, TotalSupply } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { getL0Url } from '../../utils/networkUrls';

const { REACT_APP_MAINNET_TWO_L0_NODE_URL } = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = getL0Url(network);
  return `${url}/dag`;
};

export const useGetLatestSnapshotTotalDagSupply = () => {
  return useFetch<TotalSupply>(REACT_APP_MAINNET_TWO_L0_NODE_URL + '/dag/total-supply');
};

export const useGetTotalDagSupplyBySnapshot = (ordinal: number) => {
  return useFetch<TotalSupply>(getUrl() + '/' + ordinal + '/total-supply');
};

export const useGetDagBalanceForAddress = (address: string) => {
  return useFetch<Balance>(getUrl() + '/' + address + '/balance');
};

export const useGetDagBalanceForAddressOnSnapshot = (address: string, ordinal: number) => {
  return useFetch<Balance>(getUrl() + '/' + ordinal + '/' + address + '/balance');
};
