export const shorten = (value: string, separator = '...', prefixLength = 5, suffixLength = 5) =>
  value.substring(0, prefixLength) + separator + value.substring(value.length - suffixLength);
