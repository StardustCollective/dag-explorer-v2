import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { TransactionDetail } from '../../TransactionDetailView/TransactionDetail';
import { MainnetOneTransactionDetails } from '../MainnetOne/MainnetOneTransactionDetails';

export const TransactionDetailsWrapper = () => {
  const { network } = useContext(NetworkContext);

  return network === 'testnet' ? <TransactionDetail /> : <MainnetOneTransactionDetails />;
};
