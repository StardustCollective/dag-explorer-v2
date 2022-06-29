import { MainnetOneAddressBalance } from '../../types';
import { useFetch } from '../../utils/reactQuery';

export const useGetAddressBalance = (address: string) =>
  useFetch<MainnetOneAddressBalance>('https://www.dagexplorer.io/api/v1/search/' + address);
