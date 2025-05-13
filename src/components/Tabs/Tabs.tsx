"use client";

import clsx from "clsx";
import React, { useRef, useEffect, useState, useCallback } from "react";

import { TabsContext } from "./TabsContext";

export type ITabsProps = {
  value: string;
  onValue?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
};

export const Tabs = ({ value, onValue, children, className }: ITabsProps) => {
  const tabsRef = useRef<
    Record<string, HTMLDivElement | HTMLAnchorElement | null>
  >({});
  const [gliderStyle, setGliderStyle] = useState<React.CSSProperties>({});

  const updateGliderStyle = useCallback(() => {
    const tab = tabsRef.current[value];

    if (!tab) {
      return;
    }

    setGliderStyle({
      width: tab.offsetWidth,
      transform: `translateX(${tab.offsetLeft}px)`,
    });
  }, [value]);

  useEffect(() => {
    updateGliderStyle();
  }, [value, children]);

  useEffect(() => {
    window.addEventListener("resize", updateGliderStyle);
    return () => {
      window.removeEventListener("resize", updateGliderStyle);
    };
  }, [updateGliderStyle]);

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
      <div
        className={clsx(
          "relative flex grow overflow-x-auto overflow-y-hidden",
          className
        )}
      >
        <div className="w-full flex flex-nowrap mx-6 gap-6">{children}</div>
        <div
          className="flex h-0.5 absolute bg-hgtp-blue-600 bottom-0 transition-all duration-200 ease-out"
          style={gliderStyle}
        ></div>
      </div>
    </TabsContext.Provider>
  );
};
