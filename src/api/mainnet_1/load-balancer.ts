import { MainnetOneClusterInfo, MainnetOneAddressBalance } from '../../types';
import { useFetch } from '../../utils/reactQuery';

export const useGetAddressBalance = (address: string) =>
  useFetch<MainnetOneAddressBalance>('https://dag-explorer.firebaseapp.com/api/v1/search/' + address);

export const useGetClusterInfo = () =>
  useFetch<MainnetOneClusterInfo>('https://dag-explorer.firebaseapp.com/api/node/cluster/info');
