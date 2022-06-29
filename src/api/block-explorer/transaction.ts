import { useFetch } from '../../utils/reactQuery';
import { Transaction } from '../../types';

const { REACT_APP_TESTNET_BLOCK_EXPLORER_URL } = process.env;
const URL = REACT_APP_TESTNET_BLOCK_EXPLORER_URL + '/transactions';

export const useGetTransaction = (hash: string) => useFetch<Transaction>(URL + '/' + hash);

export const useGetAllTransactions = (params?: any) => useFetch<Transaction[]>(URL, params, { keepPreviousData: true });
