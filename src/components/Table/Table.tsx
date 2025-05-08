import clsx from "clsx";
import React, { use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { EmptyState } from "../EmptyState";
import { RouterRefreshButton } from "../RouterRefresh";

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
  pagination?: React.ReactNode;
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

  const data = isPromiseLike(promisedData) ? use(promisedData) : promisedData;

  return (
    <table
      className={clsx(
        !noCardStyle &&
          "md:border md:border-gray-300 md:rounded-lg md:bg-white md:shadow-sm",
        "border-separate border-spacing-0",
        className
      )}
    >
      <thead className="hidden md:table-header-group">
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
                "bg-gray-100",
                "first:pl-2 last:pr-2",
                header && "border-t border-gray-200",
                !header && "first:rounded-tl-lg last:rounded-tr-lg",
                [loading && (loadingData?.length ?? 0) === 0].some((v) => v) &&
                  "first:rounded-bl-lg last:rounded-br-lg"
              )}
              style={{
                width: `${((colWidths?.[key] ?? 1) / totalWidth) * 100}%`,
              }}
              key={key}
            >
              <div
                className={clsx(
                  "flex flex-nowrap w-full items-center gap-1.5",
                  "text-sm font-semibold text-gray-700",
                  "min-h-12 px-4"
                )}
              >
                {value}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="flex flex-col gap-3 md:table-row-group">
        {!loading &&
          data.map((record, idx) => (
            <tr
              key={String(record[primaryKey])}
              className={clsx(
                "flex flex-col gap-3 md:table-row px-4 py-5",
                "border border-gray-300 rounded-lg bg-white shadow-sm",
                "md:border-none md:rounded-none md:bg-transparent md:shadow-none"
              )}
            >
              {getEntries(titles).map(([key]) => {
                const value = record[key];
                return (
                  <td
                    className={clsx(
                      "whitespace-nowrap",
                      "md:border-t md:border-gray-200",
                      "md:first:pl-2 md:last:pr-2",
                      idx % 2 === 0 && "md:bg-gray-25",
                      idx === data.length - 1 &&
                        !pagination &&
                        "md:first:rounded-bl-lg md:last:rounded-br-lg"
                    )}
                    key={`${record[primaryKey]}:${key}`}
                  >
                    <div
                      className={clsx(
                        "flex flex-nowrap items-center justify-between w-full",
                        "md:min-h-16 md:px-4",
                        colClassNames?.[key]
                      )}
                    >
                      <span className="inline-block md:hidden text-gray-600 uppercase font-medium">
                        {titles[key]}
                      </span>
                      {format?.[key]?.(value, record) ?? value}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        {!loading && data.length === 0 && (
          <tr className="flex md:table-row">
            <td
              className="w-full md:w-auto"
              colSpan={getEntries(titles).length}
            >
              {emptyState ?? <EmptyState />}
            </td>
          </tr>
        )}
        {loading &&
          loadingData &&
          loadingData.map((record, idx) => (
            <tr
              key={`loading:${idx}`}
              className={clsx(
                "flex flex-col gap-3 md:table-row px-4 py-5",
                "border border-gray-300 rounded-lg bg-white shadow-sm",
                "md:border-none md:rounded-none md:bg-transparent md:shadow-none"
              )}
            >
              {getEntries(titles).map(([key]) => {
                const value = record[key];
                return (
                  <td
                    className={clsx(
                      "whitespace-nowrap",
                      "md:border-t md:border-gray-200",
                      "md:first:pl-2 md:last:pr-2",
                      idx % 2 === 0 && "md:bg-cafa",
                      idx === loadingData.length - 1 &&
                        !pagination &&
                        "first:rounded-bl-lg last:rounded-br-lg"
                    )}
                    key={`loading:${idx}:${key}`}
                  >
                    <div
                      className={clsx(
                        "flex flex-nowrap items-center justify-between w-full",
                        "md:min-h-16 md:px-4"
                      )}
                    >
                      <span className="inline-block md:hidden text-gray-600 uppercase font-medium">
                        {titles[key]}
                      </span>
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
          <tr className="flex md:table-row">
            <td
              className={clsx(
                "md:border-t md:border-gray-200",
                "md:first:rounded-bl-lg md:last:rounded-br-lg",
                "w-full md:w-auto"
              )}
              colSpan={getEntries(titles).length}
            >
              {pagination}
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
        <TableBase {...props} />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export const Table = Object.assign(TableBase, {
  Suspense: TableSuspense,
});
