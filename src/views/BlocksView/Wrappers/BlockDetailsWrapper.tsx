import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { BlockDetails } from '../BlockDetails';
import { NotFound } from '../../NotFoundView/NotFound';

export const BlockDetailsWrapper = () => {
  const { networkVersion } = useContext(NetworkContext);

  if(!networkVersion) {
    return <></>
  }
  
  return networkVersion === '2.0' ? <BlockDetails /> : <NotFound entire errorCode={'404'} />;
};
