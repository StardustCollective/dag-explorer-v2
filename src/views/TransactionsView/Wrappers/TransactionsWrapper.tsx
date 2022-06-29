import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { MainnetOneTransactions } from '../MainnetOne/MainnetOneTransactions';
import { Transactions } from '../Transactions';

export const TransactionsWrapper = () => {
  const { network } = useContext(NetworkContext);

  return network === 'testnet' ? <Transactions /> : <MainnetOneTransactions />;
};
