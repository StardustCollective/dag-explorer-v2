export type IAPIResponse<T> = {
  data: T;
  meta?: { limit?: number; offset?: number; total?: number; next?: string };
};

export type IAPIResponseData<T> = {
  records: T[];
  total: number;
  next?: string;
};
