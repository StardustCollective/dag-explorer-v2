import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { MetagraphInfo, MetagraphProject } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/metagraphs`;
  return url;
};

const getProjectsUrl = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  const url = `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/metagraph-projects`;
  return url;
};

export const useGetAllMetagraphs = (params?: any, refetchInterval?: number) => {
  return useFetch<{ data: MetagraphInfo[]; meta?: any }>(
    getUrl(),
    params,
    {
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};

export const useGetAllMetagraphProjects = (params?: any, refetchInterval?: number) => {
  return useFetch<{ data: MetagraphProject[]; meta: { limit: number; offset: number; total: number } }>(
    getProjectsUrl(),
    params,
    {
      refetchInterval: refetchInterval,
      retry: false,
    },
    false
  );
};

export const useGetMetagraph = (metagraphId?: string) => {
  return useFetch<MetagraphInfo>(
    `${getUrl()}/${metagraphId}`,
    {},
    {
      enabled: !!metagraphId,
    }
  );
};
