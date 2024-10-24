import { AddressRewardsResponse, Balance, Transaction } from '../../types';
import { useFetch } from '../../utils/reactQuery';
import { useNetwork } from '../../context/NetworkContext';
import { HgtpNetwork } from '../../constants';
import { getBEUrl } from '../../utils/networkUrls';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = () => {
  const { network } = useNetwork();
  const url = getBEUrl(network);
  return `${url}/addresses`;
};

const getMetagraphUrl = (metagraphId: string) => {
  const { network } = useNetwork();
  const url = getBEUrl(network);
  return `${url}/currency/${metagraphId}/addresses`;
};

export const useGetAddressTransactions = (address: string, metagraphId?: string, params?: any) => {
  const baseUrl = !metagraphId || metagraphId === 'ALL_METAGRAPHS' ? getUrl() : getMetagraphUrl(metagraphId);
  return useFetch<{ data: Transaction[]; meta?: any }>(
    baseUrl + '/' + address + '/transactions',
    params,
    {
      retry: false,
    },
    false
  );
};

export const useGetAddressSentTransactions = (address: string) => {
  return useFetch<Transaction[]>(getUrl() + '/' + address + '/transactions/sent');
};

export const useGetAddressReceivedTransactions = (address: string) => {
  return useFetch<Transaction[]>(getUrl() + '/' + address + '/transactions/received');
};

export const useGetAddressBalance = (address: string) => {
  return useFetch<Balance>(getUrl() + '/' + address + '/balance');
};

export const useGetAddressTotalRewards = (address: string, network: Exclude<HgtpNetwork, 'mainnet1'>) => {
  return useFetch<{ totalAmount: number; isValidator: boolean }>(
    REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/addresses/' + address + '/total-rewards'
  );
};

export const useGetAddressRewards = (
  address: string,
  network: Exclude<HgtpNetwork, 'mainnet1'>,
  params?: Record<any, any>
) => {
  return useFetch<{ data: AddressRewardsResponse[]; meta: { limit: number; offset: number; total: number } }>(
    REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/addresses/' + address + '/rewards',
    { ...params, groupingMode: 'day' },
    undefined,
    false
  );
};

export const useGetAddressMetagraphRewards = (
  address: string,
  metagraphId: string,
  network: Exclude<HgtpNetwork, 'mainnet1'>,
  params?: Record<any, any>
) => {
  return useFetch<{ data: AddressRewardsResponse[]; meta: { limit: number; offset: number; total: number } }>(
    REACT_APP_DAG_EXPLORER_API_URL +
      '/' +
      network +
      '/addresses/' +
      address +
      '/metagraphs/' +
      metagraphId +
      '/rewards',
    { ...params, groupingMode: 'day' },
    undefined,
    false
  );
};
