import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Block } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_TESTNET_BE_URL, REACT_APP_MAINNET_TWO_BE_URL } = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = network === 'mainnet' ? REACT_APP_MAINNET_TWO_BE_URL : REACT_APP_TESTNET_BE_URL;
  return `${url}/blocks`;
};

export const useGetBlock = (hash: string) => {
  return useFetch<Block>(getUrl() + '/' + hash);
};
