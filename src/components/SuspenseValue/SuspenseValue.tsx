import React, { use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { isPromiseLike } from "@/utils";

export type ISuspenseValueProps<E extends React.ElementType = any> = Omit<
  React.ComponentPropsWithoutRef<E extends React.ElementType ? E : "span">,
  "value" | "fallback" | "as"
> & {
  value: Promise<React.ReactNode> | React.ReactNode;
  fallback?: React.ReactNode;
  as?: E;
};

export const SuspenseValueBase = <E extends React.ElementType = any>({
  value,
  fallback,
  as,
  ...props
}: ISuspenseValueProps<E>) => {
  const awaitedValue = use(
    isPromiseLike(value) ? value : Promise.resolve(value)
  );

  const Rendered = as ?? "span";

  return <Rendered {...props}>{awaitedValue}</Rendered>;
};

export const SuspenseValue = <E extends React.ElementType = any>({
  value,
  fallback,
  as,
  ...props
}: ISuspenseValueProps<E>) => {
  const Rendered = as ?? "span";

  return (
    <ErrorBoundary fallback={<Rendered {...props}>{fallback}</Rendered>}>
      <React.Suspense fallback={<Rendered {...props}>{fallback}</Rendered>}>
        <SuspenseValueBase {...({ value, as, ...props } as any)} />
      </React.Suspense>
    </ErrorBoundary>
  );
};
