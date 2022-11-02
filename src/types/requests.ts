type Params = {
  limit: number;
  search_after?: string;
  search_before?: string;
  next?: string;
};

type FetchedData<T> = {
  data: T[];
  page: number;
  next?: string;
};

export type { Params, FetchedData };
