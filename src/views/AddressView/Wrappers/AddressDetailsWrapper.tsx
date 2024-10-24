import { useContext } from 'react';
import { HgtpNetwork } from '../../../constants';
import { NetworkContext } from '../../../context/NetworkContext';
import { AddressDetails } from '../AddressDetails';
import { MainnetOneAddressDetails } from '../MainnetOne/MainnetOneAddressDetails';

export const AddressDetailsWrapper = () => {
  const { networkVersion, network } = useContext(NetworkContext);
  if(!networkVersion){
    return <></>
  }
  return networkVersion === '2.0' ? (
    <AddressDetails network={network as Exclude<HgtpNetwork, 'mainnet1'>} />
  ) : (
    <MainnetOneAddressDetails />
  );
};
