import React, { useContext } from 'react';

import styles from './Tab.module.scss';
import { TabsContext } from './TabsContext';
import clsx from 'clsx';

export const Tab = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const tabsContext = useContext(TabsContext);

  if (!tabsContext) {
    throw new Error('<Tabs.Tab/> must be rendered inside a <Tabs/> component');
  }

  return (
    <div
      className={clsx(styles.main, tabsContext.value === id && styles.selected)}
      onClick={() => tabsContext.onValue(id)}
      ref={(element) => tabsContext.onRef(id, element)}
    >
      {children}
    </div>
  );
};
