import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { AddressDetails } from '../AddressDetails';
import { MainnetOneAddressDetails } from '../MainnetOne/MainnetOneAddressDetails';

export const AddressDetailsWrapper = () => {
  const { network } = useContext(NetworkContext);

  return network === 'testnet' ? <AddressDetails /> : <MainnetOneAddressDetails />;
};
