import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { MainnetOneSnapshotDetails } from '../MainnetOne/MainnetOneSnapshotDetails';
import { SnapshotDetails } from '../SnapshotDetails';

export const SnapshotDetailsWrapper = () => {
  const { networkVersion } = useContext(NetworkContext);

  return networkVersion === '2.0' ? <SnapshotDetails /> : <MainnetOneSnapshotDetails />;
};
