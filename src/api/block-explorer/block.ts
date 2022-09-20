import { useFetch } from '../../utils/reactQuery';
import { Block } from '../../types';

const { REACT_APP_TESTNET_BE_URL } = process.env;
const URL = REACT_APP_TESTNET_BE_URL + '/blocks';

export const useGetBlock = (hash: string) => useFetch<Block>(URL + '/' + hash);
