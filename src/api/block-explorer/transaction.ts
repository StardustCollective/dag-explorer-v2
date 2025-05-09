import { useFetch } from '../../utils/reactQuery';
import { MetagraphTransactionResponse, Transaction } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { getBEUrl } from '../../utils/networkUrls';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = (metagraphId?: string) => {
  const { network } = useNetwork();
  const url = getBEUrl(network);
  return metagraphId ? `${url}/currency/${metagraphId}/transactions` : `${url}/transactions`;
};

export const useGetTransaction = (hash: string, metagraphId?: string) => {
  const { network } = useNetwork();
  if (metagraphId) {
    const url = `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/metagraphs/${metagraphId}/transactions/${hash}`;
    return useFetch<MetagraphTransactionResponse>(url);
  }

  const url = `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/transactions/${hash}`;
  return useFetch<MetagraphTransactionResponse>(url);
};

export const useGetAllTransactions = (params?: any, refetchInterval?: number, metagraphId?: string) => {
  return useFetch<{ data: Transaction[]; meta?: any }>(
    getUrl(metagraphId),
    params,
    {
      refetchInterval,
      retry: false,
    },
    false
  );
};

export const useGetLatestDAGTransactions = (params?: any, refetchInterval?: number) => {
  const { network } = useNetwork();
  const url = REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/dag/latest-transactions';
  return useFetch<{ data: Transaction[]; meta?: any }>(
    url,
    params,
    {
      refetchInterval,
      retry: false,
    },
    false
  );
};

export const useGetLatestMetagraphTransactions = (params?: any, refetchInterval?: number) => {
  const { network } = useNetwork();
  const url = REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/metagraph/latest-transactions';
  return useFetch<{ data: Transaction[]; meta?: any }>(
    url,
    params,
    {
      refetchInterval,
      retry: false,
    },
    false
  );
};
