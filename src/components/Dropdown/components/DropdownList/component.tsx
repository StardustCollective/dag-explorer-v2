import React from 'react';
import cls from 'classnames';

import styles from './component.module.scss';

/**
 * @uses z-index
 * @key DropdownList
 * @value 10
 */
const DropdownList = React.forwardRef<
  HTMLDivElement,
  {
    positionStatic?: boolean;
    children?: React.ReactNode;
    className?: string;
  } & Omit<JSX.IntrinsicElements['div'], 'className' | 'style'>
>(({ positionStatic, className, children, ...props }, ref) => {
  return (
    <div {...props} className={cls(styles.main, !positionStatic && styles.absolute, className)} ref={ref}>
      {children}
    </div>
  );
});

DropdownList.displayName = 'DropdownList';

export { DropdownList };
