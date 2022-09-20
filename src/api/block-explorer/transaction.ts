import { useFetch } from '../../utils/reactQuery';
import { Transaction } from '../../types';

const { REACT_APP_TESTNET_BE_URL } = process.env;
const URL = REACT_APP_TESTNET_BE_URL + '/transactions';

export const useGetTransaction = (hash: string) => useFetch<Transaction>(URL + '/' + hash);

export const useGetAllTransactions = (params?: any, refetchInterval?: number) => {
  return useFetch<Transaction[]>(URL, params, {
    keepPreviousData: true,
    refetchInterval: refetchInterval,
    retry: false,
  });
};
