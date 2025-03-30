import clsx from "clsx";
import React, { use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { RouterRefreshButton } from "../RouterRefresh";

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
  colClassNames?: {
    [P in R extends Record<infer K, any> ? K : never]?: string;
  };
  loading?: boolean;
  loadingData?: Record<keyof R, any>[];
  loadingState?: React.ReactNode;
  noCardStyle?: boolean;
  header?: React.ReactNode;
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
  colClassNames,
  loading,
  loadingData,
  loadingState,
  noCardStyle,
  header,
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
        !noCardStyle && "card",
        "border-separate border-spacing-0",
        className
      )}
    >
      <thead>
        {header && (
          <tr>
            <td colSpan={getEntries(titles).length}>{header}</td>
          </tr>
        )}
        <tr>
          {getEntries(titles).map(([key, value]) => (
            <th
              className={clsx(
                "whitespace-nowrap",
                "uppercase bg-c1f5",
                "first:pl-2 last:pr-2",
                header && "border-t border-gray-200",
                !header && "first:rounded-tl-xl last:rounded-tr-xl",
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
              <div
                className={clsx(
                  "flex flex-nowrap w-full items-center gap-1.5",
                  "text-xs font-semibold text-gray-600",
                  "min-h-16 px-4"
                )}
              >
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
                      "first:pl-2 last:pr-2",
                      idx % 2 === 0 && "bg-cafa",
                      idx === data.length - 1 &&
                        "first:rounded-bl-xl last:rounded-br-xl"
                    )}
                    style={{ width: `${100 / getEntries(titles).length}%` }}
                    key={`${record[primaryKey]}:${key}`}
                  >
                    <div
                      className={clsx(
                        "flex flex-nowrap items-center",
                        "min-h-16 px-4",
                        colClassNames?.[key]
                      )}
                    >
                      {format?.[key]?.(value, record) ?? value}
                    </div>
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
                      "first:pl-2 last:pr-2",
                      idx % 2 === 0 && "bg-cafa",
                      idx === loadingData.length - 1 &&
                        "first:rounded-bl-xl last:rounded-br-xl"
                    )}
                    style={{ width: `${100 / getEntries(titles).length}%` }}
                    key={`loading:${idx}:${key}`}
                  >
                    <div
                      className={clsx(
                        "flex flex-nowrap items-center w-full",
                        "min-h-16 px-4"
                      )}
                    >
                      {value}
                    </div>
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
    <ErrorBoundary
      fallback={
        <TableBase
          {...props}
          loading={false}
          data={[]}
          emptyState={
            <div className="flex flex-col gap-2 justify-center items-center p-3">
              <span className="text-center">
                There was an error while loading this table data, please retry.
                <br />
                If the problem persists please contact our customer support
                channels.
              </span>
              <RouterRefreshButton className="button primary outlined sm w-80">
                Retry
              </RouterRefreshButton>
            </div>
          }
        />
      }
    >
      <React.Suspense
        fallback={<TableBase {...props} loading={true} data={[]} />}
      >
        <TableBase {...props} loading={false} />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export const Table = Object.assign(TableBase, {
  Suspense: TableSuspense,
});
