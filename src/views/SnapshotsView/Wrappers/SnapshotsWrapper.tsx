import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { MainnetOneSnapshots } from '../MainnetOne/MainnetOneSnapshots';
import { Snapshots } from '../Snapshots';

export const SnapshotsWrapper = () => {
  const { network } = useContext(NetworkContext);

  return network === 'testnet' ? <Snapshots /> : <MainnetOneSnapshots />;
};
