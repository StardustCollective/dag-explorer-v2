import { useFetch } from '../../utils/reactQuery';
import { Peer, ValidatorNode } from '../../types';
import { Network } from '../../constants';

export { useGetLatestSnapshot, useGetSnapshot, useGetLatestSnapshotOrdinal } from './global-snapshot';
export {
  useGetLatestSnapshotTotalDagSupply,
  useGetTotalDagSupplyBySnapshot,
  useGetDagBalanceForAddress,
  useGetDagBalanceForAddressOnSnapshot,
} from './dag';

const { REACT_APP_TESTNET_L0_NODE_URL, REACT_APP_DAG_EXPLORER_API_URL } = process.env;

export const useGetClusterInfo = () => useFetch<Peer[]>(REACT_APP_TESTNET_L0_NODE_URL + '/cluster/info');

export const useGetMetric = () => useFetch<string>(REACT_APP_TESTNET_L0_NODE_URL + '/metric');

export const useGetProxyClusterInfo = () =>
  useFetch<string>('https://proxy.constellationnetwork.io/api/l0/cluster/info');

export const useGetValidatorNodes = (network: Exclude<Network, 'mainnet1'>) =>
  useFetch<ValidatorNode[]>(REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes');

export const useGetClusterRewards = (network: Exclude<Network, 'mainnet1'>) =>
  useFetch<{ totalRewards: number }>(REACT_APP_DAG_EXPLORER_API_URL + '/' + network + '/validator-nodes/rewards');
