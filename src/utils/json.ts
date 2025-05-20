export const safeJsonParse = <T>(value: any, defaultValue: T) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
};
