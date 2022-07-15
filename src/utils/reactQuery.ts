import { api } from './api';
import { useQuery, UseQueryOptions } from 'react-query';
import { QueryFunctionContext } from 'react-query/types/core/types';

type QueryKeyT = [string, object | undefined];

export const fetcher = async <T>({ queryKey }: QueryFunctionContext<QueryKeyT>, afterFetch?: (any) => Promise<T> ): Promise<T> => {
  const [url, params] = queryKey;
  const res = await api.get<T>(url, { ...params });

  if (afterFetch) {
    return afterFetch(res);
  }

  return res;
};

export const useFetch = <T>(url: string | null, params?: object, config?: UseQueryOptions<T, Error, T, QueryKeyT>, dataOnly = true) => {
  const context = useQuery<T, Error, T, QueryKeyT>(
    [url, params],
    ({ queryKey }) => {
      return fetcher({ queryKey, meta: undefined }, (res: any) => {
        // return only data key from {data: {}, meta: {}} response structure
        if (dataOnly && res.data ) {
          return res.data;
        }
        return res;
      });
    },
    {
      enabled: !!url,
      ...config,
    }
  );

  return context;
};
