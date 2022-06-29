import { useFetch } from '../../utils/reactQuery';
import { Peer } from '../../types';

export { useGetLatestSnapshot, useGetSnapshot, useGetLatestSnapshotOrdinal } from './global-snapshot';
export {
  useGetLatestSnapshotTotalDagSupply,
  useGetTotalDagSupplyBySnapshot,
  useGetDagBalanceForAddress,
  useGetDagBalanceForAddressOnSnapshot,
} from './dag';

const { REACT_APP_TESTNET_L0_NODE_URL } = process.env;

export const useGetClusterInfo = () => useFetch<Peer[]>(REACT_APP_TESTNET_L0_NODE_URL + '/cluster/info');

export const useGetMetric = () => useFetch<string>(REACT_APP_TESTNET_L0_NODE_URL + '/metric');
