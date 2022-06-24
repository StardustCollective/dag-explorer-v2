import { useFetch } from '../../utils/reactQuery';
import { Peer } from '../types';

export { useGetLastTransactionReference } from './dag';

const { REACT_APP_L1_NODE_URL } = process.env;

export const useGetClusterInfo = () => useFetch<Peer[]>(REACT_APP_L1_NODE_URL + '/cluster/info');

export const useGetMetric = () => useFetch<string>(REACT_APP_L1_NODE_URL + '/metric');
