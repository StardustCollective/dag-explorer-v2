import { createContext } from "react";

export type ITabsContext = {
  value: string;
  onValue?: (value: string) => void;
  onRef: (id: string, element: HTMLDivElement | HTMLAnchorElement | null) => void;
};

export const TabsContext = createContext<ITabsContext | null>(null);
