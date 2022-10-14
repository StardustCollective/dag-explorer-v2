import { SearchableItem } from '../constants';
import { SPECIAL_ADDRESSES_LIST } from '../constants/specialAddresses';

export const isValidHash = new RegExp('^[a-fA-F0-9]{64}$');
export const isValidAddress = new RegExp('^DAG[0-9][a-zA-Z0-9]{36}$');
export const isValidHeight = new RegExp('^[0-9]{1,64}$');

export const getSearchInputType = (input: string): SearchableItem | undefined => {
  if (isValidHash.test(input)) {
    return SearchableItem.Transaction;
  }

  if (isValidAddress.test(input) || SPECIAL_ADDRESSES_LIST.includes(input)) {
    return SearchableItem.Address;
  }

  if (isValidHeight.test(input)) {
    return SearchableItem.Snapshot;
  }

  return undefined;
};
