import React from "react";

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

  const keys = new Set([
    ...Object.keys(_searchParams),
    ...Object.keys(_defaultParams),
  ]);
  const mergedParams: Record<string, string | undefined> = {};

  for (const key of keys) {
    const value = _searchParams[key] ?? _defaultParams[key];
    mergedParams[key] = Array.isArray(value) ? value[0] : value;
  }

  const nextSearchParams = buildSearchParams(mergedParams as any);

  return [mergedParams, nextSearchParams] as const;
};

export const withSearchParamsAsyncBoundary = <C extends React.ElementType>(
  Component: C
) => {
  return Object.assign(
    async (props: React.ComponentProps<C>) => {
      const key = new URLSearchParams(
        (await props?.searchParams) ?? {}
      ).toString();

      const nextProps = { ...props, key } as any;

      return <Component {...nextProps} />;
    },
    {
      displayName: `withSearchParamsAsyncBoundary(${
        (Component as any).displayName ?? (Component as any).name ?? "Anonymous"
      })`,
    }
  );
};
