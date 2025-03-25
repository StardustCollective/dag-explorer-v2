export type IAPIResponse<T> = {
  data: T;
  meta?: { limit?: number; offset?: number; total?: number; next?: string };
};

export type IAPIResponseArray<T> = T[] & { total: number; next?: string };
