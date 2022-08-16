import { useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';
import { Dashboard } from './Dashboard';

export const NodeExplorerWrapper = () => {
  const { network } = useContext(NetworkContext);

  return network ? <Dashboard network={network} /> : null;
};
