import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { TransactionDetail } from '../../TransactionDetailView/TransactionDetail';
import { MainnetOneTransactionDetails } from '../MainnetOne/MainnetOneTransactionDetails';
import { Network } from '../../../constants';

export const TransactionDetailsWrapper = () => {
  const { networkVersion, network } = useContext(NetworkContext);

  if (!networkVersion) {
    return <></>;
  }

  return networkVersion === '2.0' ? (
    <TransactionDetail network={network as Exclude<Network, 'mainnet1'>} />
  ) : (
    <MainnetOneTransactionDetails />
  );
};
