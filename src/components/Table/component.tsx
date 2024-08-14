import React, { useState } from 'react';
import cls from 'classnames';

import styles from './component.module.scss';
import { SkeletonSpan } from '../SkeletonSpan/component';

const RecordEntries = <K extends string, V>(record: Record<K, V>): [K, V][] => {
  return Object.entries(record) as any;
};

export type ITableProps<
  DataKeys extends string,
  TitleKeys extends DataKeys,
  SortKeys extends DataKeys & TitleKeys,
  DataRecord extends { [K in DataKeys]?: any }
> = {
  titles: Record<
    TitleKeys,
    {
      content: React.ReactNode;
      sortable?: boolean;
    }
  >;
  data: DataRecord[];
  showSkeleton?: { size: number } | null;
  emptyStateLabel?: string;
  primaryKey: keyof DataRecord;
  detailKey?: keyof DataRecord;
  formatData?: Partial<{
    [Prop in TitleKeys]: (value: DataRecord[Prop], record: DataRecord) => React.ReactNode;
  }>;
  sortedColumn?: SortKeys;
  sortedColumnType?: 'ASC' | 'DESC';
  onSort?: (key: SortKeys, type: 'ASC' | 'DESC') => void;
  variants?: 'slim'[];
  className?: {
    root?: string;

    header?: string;
    headerRow?: string;
    headerCell?: string;
    headerCellContent?: string;

    body?: string;
    bodyRow?: string;
    bodyCell?: string;
    bodyCellContent?: string;

    footer?: string;

    cells?: {
      header?: Partial<Record<TitleKeys, { cell?: string; cellContent?: string }>>;
      body?: Partial<Record<TitleKeys, { cell?: string; cellContent?: string }>>;
    };
  };
};

export const Table = <
  DataKeys extends string,
  TitleKeys extends DataKeys,
  SortKeys extends DataKeys & TitleKeys,
  DataRecord extends { [K in DataKeys]?: any }
>({
  titles,
  data,
  showSkeleton,
  emptyStateLabel,
  primaryKey,
  detailKey,
  formatData,
  sortedColumn,
  sortedColumnType,
  onSort,
  variants,
  className,
}: ITableProps<DataKeys, TitleKeys, SortKeys, DataRecord>): JSX.Element => {
  const [detailId, setDetailId] = useState<React.ReactNode | null>(null);

  if (showSkeleton) {
    data = SkeletonSpan.generateTableRecords(showSkeleton.size, Object.keys(titles)) as DataRecord[];
    formatData = {};
  }

  return (
    <table
      className={cls(
        styles.root,
        className?.root,
        variants?.map((v) => styles[v])
      )}
    >
      <thead
        className={cls(
          styles.header,
          className?.header,
          variants?.map((v) => styles[v])
        )}
      >
        <tr className={cls(styles.headerRow, className?.headerRow)}>
          {RecordEntries(titles).map(([key, { content, sortable }]) => {
            const headerCellClassNames = className?.cells?.header?.[key];

            return (
              <th className={cls(styles.headerCell, className?.headerCell, headerCellClassNames?.cell)} key={key}>
                <div
                  className={cls(
                    styles.headerCellContent,
                    sortable && styles.sortable,
                    className?.headerCellContent,
                    headerCellClassNames?.cellContent
                  )}
                  onClick={() => {
                    if (sortable) {
                      onSort &&
                        onSort(
                          key as any,
                          sortedColumn === (key as any) && sortedColumnType === 'ASC' ? 'DESC' : 'ASC'
                        );
                    }
                  }}
                >
                  {content} {sortedColumn === (key as any) ? (sortedColumnType === 'ASC' ? '▴' : '▾') : ''}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody
        className={cls(
          styles.body,
          className?.body,
          variants?.map((v) => styles[v])
        )}
      >
        {data.length === 0 && (
          <tr className={cls(styles.bodyRow, className?.bodyRow, detailKey && styles.withDetailKey)}>
            <td
              className={cls(styles.emptyStateBodyCell, styles.bodyCell, className?.bodyCell)}
              colSpan={RecordEntries(titles).length}
            >
              <div className={cls(styles.bodyCellContent, className?.bodyCellContent)}>{emptyStateLabel}</div>
            </td>
          </tr>
        )}
        {data.map((dataRecord, index) => (
          <>
            <tr
              className={cls(styles.bodyRow, className?.bodyRow, detailKey && styles.withDetailKey)}
              key={index}
              onClick={
                !detailKey
                  ? () => void 0
                  : () =>
                      setDetailId((currentKey) =>
                        currentKey === dataRecord[primaryKey] ? null : dataRecord[primaryKey]
                      )
              }
            >
              {RecordEntries(titles).map(([key, { content: headerCellContent }]) => {
                const headerCellClassNames = className?.cells?.header?.[key];

                const bodyCellClassNames = className?.cells?.body?.[key];

                const formatter = formatData?.[key];

                const content = formatter ? formatter(dataRecord[key], dataRecord) : dataRecord[key];

                return (
                  <td className={cls(styles.bodyCell, className?.bodyCell, bodyCellClassNames?.cell)} key={key}>
                    <div
                      className={cls(styles.headerCell, className?.headerCell, headerCellClassNames?.cell)}
                      key={key}
                    >
                      <span
                        className={cls(
                          styles.headerCellContent,
                          className?.headerCellContent,
                          headerCellClassNames?.cellContent
                        )}
                      >
                        {headerCellContent}
                      </span>
                    </div>
                    <div
                      className={cls(
                        styles.bodyCellContent,
                        className?.bodyCellContent,
                        bodyCellClassNames?.cellContent
                      )}
                    >
                      {content}
                    </div>
                  </td>
                );
              })}
            </tr>
            {detailKey && dataRecord[primaryKey] === detailId && (
              <tr className={cls(styles.bodyRow, className?.bodyRow)} key={index + '::detailkey'}>
                <td className={cls(styles.bodyCell, className?.bodyCell)} colSpan={Object.keys(titles).length}>
                  <div className={cls(styles.bodyCellContent, className?.bodyCellContent)}>{dataRecord[detailKey]}</div>
                </td>
              </tr>
            )}
          </>
        ))}
      </tbody>
      <tfoot
        className={cls(
          styles.footer,
          className?.footer,
          variants?.map((v) => styles[v])
        )}
      ></tfoot>
    </table>
  );
};
