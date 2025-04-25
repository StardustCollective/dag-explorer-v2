export type IPageSearchParams = Record<string, string | string[] | undefined>;

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

export const getPageSearchParamsOrDefaults = async <
  SP extends IPageSearchParams,
  DF extends IPageSearchParams
>(
  searchParams: SP | Promise<SP>,
  defaultParams: DF | Promise<DF>
) => {
  const _searchParams = await searchParams;
  const _defaultParams = await defaultParams;

  const mergedParams = Object.assign({}, _searchParams, _defaultParams);

  const nextSearchParams = buildSearchParams(mergedParams as any);

  return [mergedParams, nextSearchParams] as const;
};
