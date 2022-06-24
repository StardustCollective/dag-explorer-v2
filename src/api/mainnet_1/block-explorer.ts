import { MainnetOneSnapshot, MainnetOneTransaction } from '../types';
import { useFetch } from '../../utils/reactQuery';

const { REACT_APP_FIREBASE_REST } = process.env;

const URL = REACT_APP_FIREBASE_REST;

//const startAt = '0';
//const endAt = '9';
//const query = `?startAt="${startAt}"&endAt="${endAt}"&orderBy="$key"`;

export const useGetLatestSnapshots = (query: string) => {
  //const { network } = useContext(NetworkContext) as NetworkContextType;
  useFetch<MainnetOneSnapshot[]>(URL + '/latest/snapshots.json' + query);
};

export const useGetLatestTransactions = (params: string) =>
  useFetch<MainnetOneTransaction[]>(URL + '/latest/transactions.json' + params);
