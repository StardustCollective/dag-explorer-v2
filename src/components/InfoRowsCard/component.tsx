import React from 'react';

import styles from './component.module.scss';
import clsx from 'clsx';

export type IInfoRow = {
  icon: React.ReactNode;
  label: React.ReactNode;
  content: React.ReactNode;
};

export type IInfoRowsCardProps = { className?: string; rows: IInfoRow[] };

export const InfoRowsCard = ({ className, rows }: IInfoRowsCardProps) => {
  return (
    <div className={clsx(styles.main, className)}>
      {rows.map((row, idx) => (
        <div key={idx} className={styles.row}>
          <span className={styles.label}>
            <div className={styles.icon}>{row.icon}</div>
            {row.label}
          </span>
          <span className={styles.content}>{row.content}</span>
        </div>
      ))}
    </div>
  );
};
