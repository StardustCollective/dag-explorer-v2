import React from 'react';

export const shorten = (
  value: string | undefined | null | React.ReactElement,
  prefixLength = 5,
  suffixLength = 5,
  separator = '...'
) => {
  value = React.isValidElement(value) ? '' : value as string | null | undefined;
  value = value ?? '';
  return value.substring(0, prefixLength) + separator + value.substring(value.length - suffixLength);
};
