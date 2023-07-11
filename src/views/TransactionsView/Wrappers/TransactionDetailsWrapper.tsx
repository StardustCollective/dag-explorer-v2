import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { TransactionDetail } from '../../TransactionDetailView/TransactionDetail';
import { MainnetOneTransactionDetails } from '../MainnetOne/MainnetOneTransactionDetails';

export const TransactionDetailsWrapper = () => {
  const { networkVersion } = useContext(NetworkContext);

  if(!networkVersion) {
    return <></>
  }
  
  return networkVersion === '2.0' ? <TransactionDetail /> : <MainnetOneTransactionDetails />;
};
