import React from 'react';

import styles from './component.module.scss';
import clsx from 'clsx';

export type IInfoRow = {
  icon: React.ReactNode;
  label: React.ReactNode;
  content: React.ReactNode;
};

export type IInfoRowsCardProps = { className?: string; variants?: 'border-record'[]; rows: IInfoRow[] };

export const InfoRowsCard = ({ className, variants, rows }: IInfoRowsCardProps) => {
  return (
    <div
      className={clsx(
        styles.main,
        className,
        variants?.map((v) => styles[v])
      )}
    >
      {rows.map((row, idx) => (
        <div key={idx} className={styles.row}>
          <span className={styles.label}>
            {row.icon && <div className={styles.icon}>{row.icon}</div>}
            {row.label}
          </span>
          <span className={styles.content}>{row.content}</span>
        </div>
      ))}
    </div>
  );
};
