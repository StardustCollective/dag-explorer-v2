import React, { use } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { isPromiseLike } from "@/utils";

export type ISuspenseValueProps = {
  value: Promise<React.ReactNode> | React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
};

export const SuspenseValueBase = ({
  value,
  className,
}: ISuspenseValueProps) => {
  const awaitedValue = use(
    isPromiseLike(value) ? value : Promise.resolve(value)
  );

  return <span className={className}>{awaitedValue}</span>;
};

export const SuspenseValue = ({
  value,
  fallback,
  className,
}: ISuspenseValueProps) => {
  return (
    <ErrorBoundary fallback={fallback}>
      <React.Suspense fallback={fallback}>
        <SuspenseValueBase className={className} value={value} />
      </React.Suspense>
    </ErrorBoundary>
  );
};
