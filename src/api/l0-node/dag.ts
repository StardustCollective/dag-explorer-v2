import { useFetch } from '../../utils/reactQuery';
import { Balance, TotalSupply } from '../types';

const { REACT_APP_L0_NODE_URL } = process.env;

const URL = REACT_APP_L0_NODE_URL + '/dag';

export const useGetLatestSnapshotTotalDagSupply = () => useFetch<TotalSupply>(URL + '/total-supply');

export const useGetTotalDagSupplyBySnapshot = (ordinal: number) =>
  useFetch<TotalSupply>(URL + '/' + ordinal + '/total-supply');

export const useGetDagBalanceForAddress = (address: string) => useFetch<Balance>(URL + '/' + address + '/balance');

export const useGetDagBalanceForAddressOnSnapshot = (address: string, ordinal: number) =>
  useFetch<Balance>(URL + '/' + ordinal + '/' + address + '/balance');
