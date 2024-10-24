import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { TransactionDetail } from '../../TransactionDetailView/TransactionDetail';
import { MainnetOneTransactionDetails } from '../MainnetOne/MainnetOneTransactionDetails';
import { HgtpNetwork } from '../../../constants';

export const TransactionDetailsWrapper = () => {
  const { networkVersion, network } = useContext(NetworkContext);

  if (!networkVersion) {
    return <></>;
  }

  return networkVersion === '2.0' ? (
    <TransactionDetail network={network as Exclude<HgtpNetwork, 'mainnet1'>} />
  ) : (
    <MainnetOneTransactionDetails />
  );
};
