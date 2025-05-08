"use client";

import clsx from "clsx";
import React, { useContext } from "react";

import { TabsContext } from "./TabsContext";

export type ITabProps<T extends React.ElementType = "div"> = {
  renderAs?: T;
  id: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "className" | "children">;

export const Tab = <T extends React.ElementType = "div">({
  renderAs,
  id,
  children,
  ...props
}: ITabProps<T>) => {
  const tabsContext = useContext(TabsContext);

  if (!tabsContext) {
    throw new Error("<Tabs.Tab/> must be rendered inside a <Tabs/> component");
  }

  const RenderComponent = renderAs ?? "div";

  return (
    <RenderComponent
      className={clsx(
        "pt-5 pb-4 text-black/65 font-semibold cursor-pointer transition-all duration-200 ease-out",
        tabsContext.value === id && "text-hgtp-blue-600"
      )}
      onClick={() => tabsContext.onValue?.(id)}
      ref={(element: any) => tabsContext.onRef(id, element)}
      {...props}
    >
      {children}
    </RenderComponent>
  );
};
