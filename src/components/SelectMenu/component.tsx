import React from 'react';

import styles from './component.module.scss';
import { ISelectMenuItemProps, SelectMenuItem } from './components/SelectMenuItem/component';
import clsx from 'clsx';

export type ISelectMenuProps = {
  options: ISelectMenuItemProps[];
  open?: boolean;
  className?: string;
};

export const SelectMenu = ({ options, open, className }: ISelectMenuProps) => {
  return (
    <div className={clsx(styles.main, open && styles.open, className)}>
      {options.map((option, idx) => (
        <SelectMenuItem key={idx} {...option} />
      ))}
    </div>
  );
};
