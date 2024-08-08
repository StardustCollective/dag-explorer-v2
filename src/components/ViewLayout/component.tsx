import React from 'react';

import styles from './component.module.scss';
import clsx from 'clsx';

export type IViewLayoutProps = { className?: string; children?: React.ReactNode };

export const ViewLayout = ({ className, children }: IViewLayoutProps) => {
  return (
    <div className={styles.main}>
      <main className={clsx(styles.content, className)}>{children}</main>
    </div>
  );
};
