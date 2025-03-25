import { IAPIResponseArray } from "@/types";

export const buildAPIResponseArray = <T>(
  records: T[],
  total: number,
  next?: string
): IAPIResponseArray<T> => {
  return Object.assign(records, { total, next });
};
