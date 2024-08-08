import React from 'react';

import clsx from 'clsx';

import styles from './component.module.scss';

export type IHorizontalBarProps = { className?: string };

export const HorizontalBar = ({ className }: IHorizontalBarProps) => {
  return <div className={clsx(styles.main, className)}></div>;
};
