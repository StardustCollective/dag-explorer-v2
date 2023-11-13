import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { AddressMetagraphResponse } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = (address: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/addresses/${address}/metagraphs`;
};

export const useGetAdressMetagraphs = (address: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return useFetch<AddressMetagraphResponse[]>(
    getUrl(address),
    {},
    {
      enabled: true,
    }
  );
};
