import React from 'react';

import styles from './component.module.scss';

const SkeletonSpanBase = () => {
  return <span className={styles.main}></span>;
};

export const SkeletonSpan = Object.assign(SkeletonSpanBase, {
  generateTableRecords: <K extends string>(size: number, keys: K[]): Record<K, React.ReactNode>[] => {
    return new Array(size).fill(null).map((_, idx) => {
      const record = {} as Record<K, React.ReactNode>;

      for (const key of keys) {
        record[key] = <SkeletonSpanBase key={idx} />;
      }

      return record;
    });
  },
  generateEmptyTableRecords: <K extends string>(size: number, keys: K[], filler = ''): Record<K, React.ReactNode>[] => {
    return new Array(size).fill(null).map((_, idx) => {
      const record = {} as Record<K, React.ReactNode>;

      for (const key of keys) {
        record[key] = filler;
      }

      return record;
    });
  },
  displayName: 'SkeletonSpan',
});
