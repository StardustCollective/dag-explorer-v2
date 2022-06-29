import { useFetch } from '../../utils/reactQuery';
import { Block } from '../../types';

const { REACT_APP_TESTNET_BLOCK_EXPLORER_URL } = process.env;
const URL = REACT_APP_TESTNET_BLOCK_EXPLORER_URL + '/blocks';

export const useGetBlock = (hash: string) => useFetch<Block>(URL + '/' + hash);
