"use client";

import React, { useRef, useEffect, useState } from "react";

import { TabsContext } from "./TabsContext";

export type ITabsProps = {
  value: string;
  onValue?: (value: string) => void;
  children?: React.ReactNode;
};

export const Tabs = ({ value, onValue, children }: ITabsProps) => {
  const tabsRef = useRef<
    Record<string, HTMLDivElement | HTMLAnchorElement | null>
  >({});
  const [gliderStyle, setGliderStyle] = useState<React.CSSProperties>({});

  const updateGliderStyle = () => {
    const tab = tabsRef.current[value];

    if (!tab) {
      return;
    }

    setGliderStyle({
      width: tab.offsetWidth,
      transform: `translateX(${tab.offsetLeft}px)`,
    });
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
      <div className="w-full relative flex overflow-x-auto overflow-y-hidden">
        <div className="w-full flex flex-nowrap mx-6 gap-6">{children}</div>
        <div
          className="flex h-0.5 absolute bg-hgtp-blue-600 bottom-0 transition-all duration-200 ease-out"
          style={gliderStyle}
        ></div>
      </div>
    </TabsContext.Provider>
  );
};
