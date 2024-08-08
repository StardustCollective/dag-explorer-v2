import { QueryFunctionContext, useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

type QueryKeyT = [string, object | undefined];

export const fetcher = async <T>(
  { queryKey }: QueryFunctionContext<QueryKeyT>,
  afterFetch?: (response: T) => Promise<T>
): Promise<T> => {
  const [url, params] = queryKey;

  const res = await axios.get<T>(url, { params });

  if (afterFetch) {
    return afterFetch(res.data);
  }

  return res.data;
};

export const useFetch = <T>(
  url: string | null,
  params?: object,
  config?: Omit<UseQueryOptions<T, Error, T, QueryKeyT>, 'queryKey'>,
  dataOnly = true
) => {
  const context = useQuery<T, Error, T, QueryKeyT>({
    queryKey: [url, params],
    queryFn: (context) => {
      return fetcher(context, (res: any) => {
        // return only data key from {data: {}, meta: {}} response structure
        if (dataOnly && res.data) {
          return res.data;
        }

        return res;
      });
    },
    enabled: !!url,
    ...config,
  });

  return context;
};
