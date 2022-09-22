import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { MainnetOneSnapshots } from '../MainnetOne/MainnetOneSnapshots';
import { Snapshots } from '../Snapshots';

export const SnapshotsWrapper = () => {
  const { networkVersion } = useContext(NetworkContext);

  return networkVersion === '2.0' ? <Snapshots /> : <MainnetOneSnapshots />;
};
