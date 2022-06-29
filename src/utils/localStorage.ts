export const getLocalStorage = (key, initialValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? value : initialValue;
  } catch (e) {
    console.log(e);
    return initialValue;
  }
};
