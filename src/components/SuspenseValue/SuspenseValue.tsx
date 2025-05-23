import React, { use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { isPromiseLike } from "@/utils";

export type ISuspenseValueProps<E extends React.ElementType = any> = Omit<
  React.ComponentPropsWithoutRef<E extends React.ElementType ? E : "span">,
  "value" | "fallback" | "renderAs"
> & {
  value: Promise<React.ReactNode> | React.ReactNode;
  fallback?: React.ReactNode;
  renderAs?: E;
};

export const SuspenseValueBase = <E extends React.ElementType = any>({
  value,
  fallback,
  renderAs,
  ...props
}: ISuspenseValueProps<E>) => {
  const awaitedValue = isPromiseLike(value) ? use(value) : value;

  const Rendered = renderAs ?? "span";

  return <Rendered {...props}>{awaitedValue}</Rendered>;
};

export const SuspenseValue = <E extends React.ElementType = any>({
  value,
  fallback,
  renderAs,
  ...props
}: ISuspenseValueProps<E>) => {
  const Rendered = renderAs ?? "span";

  return (
    <ErrorBoundary fallback={<Rendered {...props}>{fallback}</Rendered>}>
      <React.Suspense fallback={<Rendered {...props}>{fallback}</Rendered>}>
        <SuspenseValueBase {...({ value, renderAs, ...props } as any)} />
      </React.Suspense>
    </ErrorBoundary>
  );
};
