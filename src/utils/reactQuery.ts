import { api } from './api';
import { useQuery, UseQueryOptions } from 'react-query';
import { QueryFunctionContext } from 'react-query/types/core/types';

type QueryKeyT = [string, object | undefined];

export const fetcher = <T>({ queryKey }: QueryFunctionContext<QueryKeyT>): Promise<T> => {
  const [url, params] = queryKey;
  return api.get<T>(url, { ...params }).then((res) => res);
};

export const useFetch = <T>(url: string | null, params?: object, config?: UseQueryOptions<T, Error, T, QueryKeyT>) => {
  const context = useQuery<T, Error, T, QueryKeyT>(
    [url!, params],
    ({ queryKey }) => {
      return fetcher({ queryKey, meta: undefined });
    },
    {
      enabled: !!url,
      ...config,
    }
  );

  return context;
};
