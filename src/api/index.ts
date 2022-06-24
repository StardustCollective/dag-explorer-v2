import { useFetch } from '../utils/reactQuery';

const { REACT_APP_TESTNET_LB } = process.env;

export const useGetTotalSupply = () => useFetch<string>(REACT_APP_TESTNET_LB + '/total-supply');
