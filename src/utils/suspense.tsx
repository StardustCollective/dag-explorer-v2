import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const withSuspense = <C extends React.ElementType>(
  Component: C,
  Fallback?: C,
  ErrorFallback?: C
) => {
  ErrorFallback = ErrorFallback ?? Fallback;

  return Object.assign(
    (props: React.ComponentProps<C>) => {
      return (
        <ErrorBoundary
          fallback={ErrorFallback ? <ErrorFallback {...props} /> : undefined}
        >
          <Suspense fallback={Fallback ? <Fallback {...props} /> : undefined}>
            <Component {...props} />
          </Suspense>
        </ErrorBoundary>
      );
    },
    {
      displayName: `withSuspense(${
        (Component as any).displayName ?? (Component as any).name ?? "Anonymous"
      })`,
    }
  );
};
