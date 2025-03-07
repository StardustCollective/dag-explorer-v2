export type IAPIResponse<T> = {
  data: T;
  meta?: { limit?: number; offset?: number; total?: number };
};

export type IAPIResponseArray<T> = T[] & { total: number };
