import axios from 'axios';
import { HgtpNetwork, SearchableItem } from '../constants';
import { SPECIAL_ADDRESSES_LIST } from '../constants/specialAddresses';
import { getBEUrl } from './networkUrls';

export const isValidHash = new RegExp('^[a-fA-F0-9]{64}$');
export const isValidAddress = new RegExp('^DAG[0-9][a-zA-Z0-9]{36}$');
export const isValidHeight = new RegExp('^[0-9]{1,64}$');

export const getSearchInputType = (input: string): SearchableItem | undefined => {
  if (isValidHash.test(input)) {
    return SearchableItem.Hash;
  }

  if (isValidAddress.test(input) || SPECIAL_ADDRESSES_LIST.includes(input)) {
    return SearchableItem.Address;
  }

  if (isValidHeight.test(input)) {
    return SearchableItem.Snapshot;
  }

  return undefined;
};

export const checkIfBEUrlExists = async (path: string, network: HgtpNetwork): Promise<boolean> => {
  try {
    const url = `${getBEUrl(network)}/${path}`;
    const response = await axios.get(url);
    return response.status !== 404;
  } catch (e) {
    return false;
  }
};
