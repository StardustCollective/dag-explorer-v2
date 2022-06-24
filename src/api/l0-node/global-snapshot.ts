import { useFetch } from '../../utils/reactQuery';
import { Snapshot } from '../types';

const { REACT_APP_TESTNET_L0_NODE_URL } = process.env;

const URL = REACT_APP_TESTNET_L0_NODE_URL + '/global-snapshot';

//returns binary file
export const useGetLatestSnapshot = () => useFetch<Snapshot>(URL + '/latest');

//returns { value: 123 }
export const useGetLatestSnapshotOrdinal = () => useFetch<{ value: number }>(URL + '/latest/ordinal');

//returns binary file
export const useGetSnapshot = (ordinal: number) => useFetch<Snapshot>(URL + '/' + ordinal);
