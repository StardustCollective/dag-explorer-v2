import { useFetch } from '../../utils/reactQuery';
import { TotalSupply } from '../types';

const { REACT_APP_TESTNET_L1_NODE_URL } = process.env;

const URL = REACT_APP_TESTNET_L1_NODE_URL + '/dag';

export const useGetLastTransactionReference = (address: string) =>
  useFetch<TotalSupply>(URL + '/transaction/last-reference/' + address);
