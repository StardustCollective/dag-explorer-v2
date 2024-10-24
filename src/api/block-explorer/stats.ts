import { useFetch } from '../../utils/reactQuery';
import { useNetwork } from '../../context/NetworkContext';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

export const useGetNetworkStats = (params?: any, refetchInterval?: number) => {
  const { network } = useNetwork();
  const url = REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/stats';
  return useFetch<{
    data: {
      snapshots90d: number;
      fees90d: number;
      snapshotsTotal: number;
      feesTotal: number;
      totalLockedInDatum: number;
    };
    meta?: any;
  }>(
    url,
    params,
    {
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};
