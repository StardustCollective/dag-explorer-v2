import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { AddressMetagraphResponse, Snapshot } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getMetagraphsUrl = (address: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/addresses/${address}/metagraphs`;
};

const getMetagraphSnapshotsUrl = (address: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/addresses/${address}/metagraph-snapshots`;
};

export const useGetAddressMetagraphs = (address: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return useFetch<AddressMetagraphResponse[]>(
    getMetagraphsUrl(address),
    {},
    {
      enabled: true,
    }
  );
};

export const useGetAddressMetagraphSnapshots = (address?: string, params?: any) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return useFetch<{ data: Snapshot[]; meta?: any }>(getMetagraphSnapshotsUrl(address), params, {
    enabled: !!address,
  }, false);
};
