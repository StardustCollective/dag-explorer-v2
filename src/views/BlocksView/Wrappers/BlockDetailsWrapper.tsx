import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { BlockDetails } from '../BlockDetails';
import { NotFound } from '../../NotFoundView/NotFound';

export const BlockDetailsWrapper = () => {
  const { network } = useContext(NetworkContext);
  return network === 'testnet' ? <BlockDetails /> : <NotFound entire />;
};
