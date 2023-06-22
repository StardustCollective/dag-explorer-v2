import React from 'react';
import clsx from 'clsx';

import styles from './DetailRow.module.scss';
import { Content } from './Content';

export const DetailRow = ({
  ...props
}: {
  borderBottom?: boolean;
  value?: string;
  title: string;
  linkTo?: string;
  onlyLink?: React.ReactNode;
  skeleton?: boolean;
  copy?: boolean;
  date?: string;
  subValue?: string;
  isLong?: boolean;
  isMain?: boolean;
  isStatus?: boolean;
  icon?: JSX.Element;
}) => {
  return (
    <div className={clsx(styles.txFlexRow, props.borderBottom && styles.borderBottom)}>
      <div className={styles.title}>
        <p className={'headerSubtitle'}>{props.title}</p>
      </div>
      <div className={styles.mobile}>
        <Content {...props} />
      </div>
      <div className={styles.desktop}>
        <Content {...props} isLong={false} />
      </div>
    </div>
  );
};
