import { useFetch } from '../../utils/reactQuery';
import { Snapshot } from '../../types';
import { useNetwork } from '../../context/NetworkContext';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

export const useGetLatestDAGSnapshots = (params?: any, refetchInterval?: number) => {
  const { network } = useNetwork();
  const url = REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/dag/latest-snapshots';
  return useFetch<{ data: Snapshot[]; meta?: any }>(
    url,
    params,
    {
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};

export const useGetLatestMetagraphSnapshots = (params?: any, refetchInterval?: number) => {
  const { network } = useNetwork();
  const url = REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/metagraph/latest-snapshots';
  return useFetch<{ data: Snapshot[]; meta?: any }>(
    url,
    params,
    {
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};
