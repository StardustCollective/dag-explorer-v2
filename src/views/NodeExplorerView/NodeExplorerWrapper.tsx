import { useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';
import { NotFound } from '../NotFoundView/NotFound';
import { Dashboard } from './Dashboard';

export const NodeExplorerWrapper = () => {
  const { network } = useContext(NetworkContext);

  return network && network !== 'mainnet1' ? <Dashboard network={network} /> : <NotFound entire errorCode={'404'} />;
};
