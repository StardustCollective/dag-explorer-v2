import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { MainnetOneTransactions } from '../MainnetOne/MainnetOneTransactions';
import { Transactions } from '../Transactions';

export const TransactionsWrapper = () => {
  const { networkVersion } = useContext(NetworkContext);

  if(!networkVersion) {
    return <></>
  }
  
  return networkVersion === '2.0' ? <Transactions /> : <MainnetOneTransactions />;
};
