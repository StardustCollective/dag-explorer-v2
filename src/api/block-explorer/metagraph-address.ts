import { useFetch } from '../../utils/reactQuery';
import { AddressMetagraphResponse, Snapshot } from '../../types';
import { useNetwork } from '../../context/NetworkContext';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getMetagraphsUrl = (address: string) => {
  const { network } = useNetwork();
  return `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/addresses/${address}/metagraphs`;
};

const getMetagraphSnapshotsUrl = (address: string) => {
  const { network } = useNetwork();
  return `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/addresses/${address}/metagraph-snapshots`;
};

export const useGetAddressMetagraphs = (address: string, params?: any) => {
  const { network } = useNetwork();
  return useFetch<AddressMetagraphResponse[]>(getMetagraphsUrl(address), params, {
    enabled: true,
  });
};

export const useGetAddressMetagraphSnapshots = (address?: string, params?: any) => {
  const { network } = useNetwork();
  return useFetch<{ data: Snapshot[]; meta?: any }>(
    getMetagraphSnapshotsUrl(address),
    params,
    {
      enabled: !!address,
    },
    false
  );
};
