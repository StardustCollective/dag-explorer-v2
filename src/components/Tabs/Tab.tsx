"use client";

import clsx from "clsx";
import React, { useContext } from "react";

import { TabsContext } from "./TabsContext";

export type ITabProps = {
  id: string;
  href?: string;
  children: React.ReactNode;
};

export const Tab = ({ id, href, children }: ITabProps) => {
  const tabsContext = useContext(TabsContext);

  if (!tabsContext) {
    throw new Error("<Tabs.Tab/> must be rendered inside a <Tabs/> component");
  }

  const RenderComponent = href ? "a" : "div";

  return (
    <RenderComponent
      href={href ?? ""}
      className={clsx(
        "pt-5 pb-4 text-black/65 font-semibold cursor-pointer transition-all duration-200 ease-out",
        tabsContext.value === id && "text-hgtp-blue-600"
      )}
      onClick={() => tabsContext.onValue?.(id)}
      ref={(element: HTMLDivElement | HTMLAnchorElement | null) =>
        tabsContext.onRef(id, element)
      }
    >
      {children}
    </RenderComponent>
  );
};
