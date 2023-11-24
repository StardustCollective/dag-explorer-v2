import { useContext } from 'react';
import { useFetch } from '../../utils/reactQuery';
import { Peer, ValidatorNode } from '../../types';
import { Network } from '../../constants';
import { NetworkContext, NetworkContextType } from '../../context/NetworkContext';
import { getL0Url } from '../../utils/networkUrls';

export { useGetLatestSnapshot, useGetSnapshot, useGetLatestSnapshotOrdinal } from './global-snapshot';
export {
  useGetLatestSnapshotTotalDagSupply,
  useGetTotalDagSupplyBySnapshot,
  useGetDagBalanceForAddress,
  useGetDagBalanceForAddressOnSnapshot,
} from './dag';

const { REACT_APP_DAG_EXPLORER_API_URL } = process.env;

const getUrl = (network: Network) => {
  return getL0Url(network);
};

export const useGetClusterInfo = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return useFetch<Peer[]>(getUrl(network) + '/cluster/info', {}, { enabled: !!network });
};

export const useGetMetric = () => {
  const { network } = useContext(NetworkContext) as NetworkContextType;
  return useFetch<string>(getUrl(network) + '/metric', {}, { enabled: !!network });
};

export const useGetValidatorNodes = (network: Exclude<Network, 'mainnet1'>) => {
  return useFetch<ValidatorNode[]>(REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes');
};

export const useGetClusterRewards = (network: Exclude<Network, 'mainnet1'>) => {
  return useFetch<{ totalRewards: number }>(
    REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes/rewards'
  );
};
