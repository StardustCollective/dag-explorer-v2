import React from 'react';

import styles from './component.module.scss';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export type INavSegment = {
  name: React.ReactNode;
  to: string;
};

export type INavPathProps = { segments: INavSegment[] };

export const NavPath = ({ segments }: INavPathProps) => {
  return (
    <div className={styles.main}>
      <span className={styles.track}>
        {segments.map((segment, idx) => (
          <React.Fragment key={idx}>
            <Link className={clsx(styles.segment, idx === segments.length - 1 && styles.last)} to={segment.to}>
              {segment.name}
            </Link>
            {idx !== segments.length - 1 && <span className={styles.separator}>{'>'}</span>}
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};
