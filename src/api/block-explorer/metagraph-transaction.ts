import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { MetagraphTransactionResponse } from '../../types';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = (transactionHash: string) => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return `${REACT_APP_DAG_EXPLORER_API_URL}/${network}/metagraphs/transactions/${transactionHash}`;
};


export const useGetMetagraphTransaction = (transactionHash: string) => {
  return useFetch<MetagraphTransactionResponse>(
    getUrl(transactionHash),
  );
};

