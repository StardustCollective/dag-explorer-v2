import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { MainnetOneSnapshotDetails } from '../MainnetOne/MainnetOneSnapshotDetails';
import { SnapshotDetails } from '../SnapshotDetails';

export const SnapshotDetailsWrapper = () => {
  const { network } = useContext(NetworkContext);

  return network === 'testnet' ? <SnapshotDetails /> : <MainnetOneSnapshotDetails />;
};
