"use client";

import { createContext, useContext, useRef } from "react";
import { StoreApi } from "zustand";
import { StoreMutators } from "zustand/vanilla";

type WithImmer<T> = StoreMutators<T, any>["zustand/immer"];

export const buildZustandProviderAndHook = <T extends WithImmer<StoreApi<any>>>(
  name: string,
  storeCreator: () => T
) => {
  const StoreContext = createContext<T | null>(null);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = useRef<T | null>(null);
    if (storeRef.current === null) {
      storeRef.current = storeCreator();
    }

    return (
      <StoreContext.Provider value={storeRef.current}>
        {children}
      </StoreContext.Provider>
    );
  };

  Object.defineProperty(Provider, "displayName", {
    value: name + "StoreProvider",
  });

  const useContextStore = (): T => {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error(
        `use${name}StoreProvider must be used within <${name}StoreProvider/>`
      );
    }

    return store;
  };

  Object.defineProperty(useContextStore, "name", {
    value: "use" + name + "StoreProvider",
  });

  return [Provider, useContextStore] as const;
};
