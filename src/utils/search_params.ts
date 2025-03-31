export const buildSearchParams = (
  defaultParams: ConstructorParameters<typeof URLSearchParams>[0]
) => {
  const searchParams = new URLSearchParams(defaultParams);

  return (nextParams?: ConstructorParameters<typeof URLSearchParams>[0]) => {
    for (const [key, value] of new URLSearchParams(nextParams).entries()) {
      searchParams.set(key, value);
    }

    for (const [key, value] of new URLSearchParams(searchParams).entries()) {
      if (value === "") {
        searchParams.delete(key);
      }
    }

    return searchParams.toString();
  };
};
