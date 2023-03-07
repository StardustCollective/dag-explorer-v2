import React from 'react';
import cls from 'classnames';

import styles from './component.module.scss';

const DropdownListItemBase = ({
  icon,
  children,
  ...props
}: {
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & Omit<JSX.IntrinsicElements['div'], 'className' | 'style'>) => {
  return (
    <div {...props} className={cls(styles.main, icon && styles.icon)}>
      {icon} {children}
    </div>
  );
};

export { DropdownListItemBase };
