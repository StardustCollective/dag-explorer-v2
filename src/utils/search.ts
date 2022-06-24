import { SearchableItem } from '../constants';

export const isValidHash = new RegExp('^[a-fA-F0-9]{64}$');
export const isValidAddress = new RegExp('^DAG[a-zA-Z0-9]{37}$');
export const isValidHeight = new RegExp('^[0-9]{1,64}$');

export const getSearchInputType = (input: string): SearchableItem | undefined => {
  if (isValidHash.test(input)) {
    return SearchableItem.Transaction;
  }

  if (isValidAddress.test(input)) {
    return SearchableItem.Address;
  }

  if (isValidHeight.test(input)) {
    return SearchableItem.Snapshot;
  }

  return undefined;
};
