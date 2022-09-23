import { useContext } from 'react';
import { NetworkContext } from '../../../context/NetworkContext';
import { AddressDetails } from '../AddressDetails';
import { MainnetOneAddressDetails } from '../MainnetOne/MainnetOneAddressDetails';

export const AddressDetailsWrapper = () => {
  const { networkVersion } = useContext(NetworkContext);

  return networkVersion === '2.0' ? <AddressDetails /> : <MainnetOneAddressDetails />;
};
