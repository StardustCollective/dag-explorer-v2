import clsx from "clsx";
import React, { use } from "react";

import { ITablePaginationProps, TablePagination } from "./TablePagination";
import { isPromiseLike } from "@/utils";

const getEntries = <K extends string, V>(record: { [P in K]?: V }): [
  K,
  V
][] => {
  return Object.entries(record) as any;
};

export type ITableProps<R extends Record<string, any>> = {
  titles: {
    [P in R extends Record<infer K, any> ? K : never]?: React.ReactNode;
  };
  data: R[] | Promise<R[]>;
  primaryKey: R extends Record<any, any> ? keyof R : never;
  format?: {
    [P in R extends Record<infer K, any> ? K : never]?: (
      value: R[P],
      record: R
    ) => React.ReactNode;
  };
  colWidths?: {
    [P in R extends Record<infer K, any> ? K : never]?: number;
  };
  loading?: boolean;
  loadingData?: Record<keyof R, any>[];
  loadingState?: React.ReactNode;
  emptyState?: React.ReactNode;
  pagination?: ITablePaginationProps;
  className?: string;
};

const TableBase = <R extends Record<string, any>>({
  data: promisedData,
  primaryKey,
  titles,
  format,
  colWidths,
  loading,
  loadingData,
  loadingState,
  emptyState,
  pagination,
  className,
}: ITableProps<R>) => {
  const totalWidth = getEntries(titles).reduce(
    (pv, [key]) => pv + (colWidths?.[key] ?? 1),
    0
  );

  const data = use(
    isPromiseLike(promisedData) ? promisedData : Promise.resolve(promisedData)
  );

  return (
    <table
      className={clsx(
        "card rounded-xl border-separate border-spacing-0",
        className
      )}
    >
      <thead>
        <tr>
          {getEntries(titles).map(([key, value]) => (
            <th
              className={clsx(
                "whitespace-nowrap",
                "py-5.5 px-4 uppercase bg-c1f5",
                "first:pl-6 last:pr-6",
                "first:rounded-tl-xl last:rounded-tr-xl",
                [
                  !loading && data.length === 0 && !emptyState,
                  loading && (loadingData?.length ?? 0) === 0,
                ].some((v) => v) && "first:rounded-bl-xl last:rounded-br-xl"
              )}
              style={{
                width: `${((colWidths?.[key] ?? 1) / totalWidth) * 100}%`,
              }}
              key={key}
            >
              <div className="flex flex-row flex-nowrap w-full items-center gap-1.5 text-xs font-semibold text-gray-600">
                {value}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!loading &&
          data.map((record, idx) => (
            <tr key={String(record[primaryKey])}>
              {getEntries(titles).map(([key]) => {
                const value = record[key];
                return (
                  <td
                    className={clsx(
                      "whitespace-nowrap",
                      "border-t border-gray-200",
                      "py-5.5 px-4",
                      "first:pl-6 last:pr-6",
                      idx % 2 === 0 && "bg-cafa",
                      idx === data.length - 1 &&
                        "first:rounded-bl-xl last:rounded-br-xl"
                    )}
                    style={{ width: `${100 / getEntries(titles).length}%` }}
                    key={`${record[primaryKey]}:${key}`}
                  >
                    <div>{format?.[key]?.(value, record) ?? value}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        {!loading && data.length === 0 && (
          <tr>
            <td colSpan={getEntries(titles).length}>{emptyState}</td>
          </tr>
        )}
        {loading &&
          loadingData &&
          loadingData.map((record, idx) => (
            <tr key={`loading:${idx}`}>
              {getEntries(titles).map(([key]) => {
                const value = record[key];
                return (
                  <td
                    className={clsx(
                      "whitespace-nowrap",
                      "border-t border-gray-200",
                      "py-5.5 px-4",
                      "first:pl-6 last:pr-6",
                      idx % 2 === 0 && "bg-cafa",
                      idx === loadingData.length - 1 &&
                        "first:rounded-bl-xl last:rounded-br-xl"
                    )}
                    style={{ width: `${100 / getEntries(titles).length}%` }}
                    key={`loading:${idx}:${key}`}
                  >
                    <div>{value}</div>
                  </td>
                );
              })}
            </tr>
          ))}
        {loading && !loadingData && (
          <tr>
            <td colSpan={getEntries(titles).length}>{loadingState}</td>
          </tr>
        )}
        {pagination && (
          <tr className="border-t-0.5 border-gray-600">
            <td
              className="first:rounded-bl-xl last:rounded-br-xl"
              colSpan={getEntries(titles).length}
            >
              <TablePagination {...pagination} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const TableSuspense = <R extends Record<string, any>>(
  props: ITableProps<R>
) => {
  return (
    <React.Suspense
      fallback={<TableBase {...props} loading={true} data={[]} />}
    >
      <TableBase {...props} loading={false} />
    </React.Suspense>
  );
};

export const Table = Object.assign(TableBase, {
  Suspense: TableSuspense,
});
