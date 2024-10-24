import { useFetch } from '../../utils/reactQuery';
import { Block } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { getBEUrl } from '../../utils/networkUrls';

const getUrl = (metagraphId?: string) => {
  const { network } = useNetwork();
  const url = getBEUrl(network);
  return metagraphId ? `${url}/currency/${metagraphId}/blocks` : `${url}/blocks`;
};

export const useGetBlock = (hash: string, metagraphId?: string) => {
  return useFetch<Block>(getUrl(metagraphId) + '/' + hash);
};
