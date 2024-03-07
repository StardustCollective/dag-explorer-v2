import React, { Children, isValidElement, ComponentProps, useRef, useEffect, useState } from 'react';

import { Tab } from './Tab';
import { TabsContext } from './TabsContext';

import styles from './Tabs.module.scss';

const TabsBase = ({
  value,
  onValue,
  children,
}: {
  value: string;
  onValue: (value: string) => void;
  children: React.ReactNode;
}) => {
  const tabsRef = useRef<Record<string, HTMLDivElement>>({});
  const [gliderStyle, setGliderStyle] = useState<React.CSSProperties>({});

  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<ComponentProps<typeof Tab>, typeof Tab> =>
      isValidElement(child) && Object.is(child.type, Tab)
  );

  const updateGliderStyle = () => {
    const tab = tabsRef.current[value];
    if (!tab) {
      return;
    }
    setGliderStyle({ width: tab.offsetWidth, transform: `translateX(${tab.offsetLeft}px)` });
  };

  useEffect(() => {
    updateGliderStyle();
  }, [value, children]);

  return (
    <TabsContext.Provider
      value={{
        value,
        onValue,
        onRef: (id, element) => {
          tabsRef.current[id] = element;
        },
      }}
    >
      <div className={styles.main}>
        <div className={styles.tabs}>{tabs}</div>
        <div className={styles.glider} style={gliderStyle}></div>
      </div>
    </TabsContext.Provider>
  );
};

const Tabs = Object.assign(TabsBase, { displayName: 'Tabs', Tab });

export { Tabs };
