import { useContext } from 'react';
import { NetworkContext } from '../../context/NetworkContext';
import { NotFound } from '../NotFoundView/NotFound';
import { Dashboard } from './Dashboard';
import { HgtpNetwork } from '../../constants';

export const NodeExplorerWrapper = () => {
  const { network, networkVersion } = useContext(NetworkContext);

  if(!networkVersion) {
    return <></>
  }
  
  return networkVersion === '2.0' ? <Dashboard network={network as Exclude<HgtpNetwork, 'mainnet1'>} /> : <NotFound entire errorCode={'404'} />;
};
