export const shorten = (value: string | undefined | null, prefixLength = 5, suffixLength = 5, separator = '...') => {
  value = value ?? '';
  return value.substring(0, prefixLength) + separator + value.substring(value.length - suffixLength);
};
