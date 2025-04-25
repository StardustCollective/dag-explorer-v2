import clsx from "clsx";
import React, { use } from "react";

import { SkeletonSpan } from "../SkeletonSpan";

import { isPromiseLike, withSuspense } from "@/utils";

export type IFormatCurrencySymbolProps = {
  currency: Promise<React.ReactNode> | React.ReactNode;
  className?: string;
};

export const FormatCurrencySymbol = withSuspense(
  function FormatCurrencySymbol({
    currency: currencyPromise,
    className,
  }: IFormatCurrencySymbolProps) {
    const currency = isPromiseLike(currencyPromise)
      ? use(currencyPromise)
      : currencyPromise;

    return (
      <span
        className={clsx(
          "inline-flex flex-nowrap items-center gap-1",
          className
        )}
      >
        {currency}
      </span>
    );
  },
  ({}) => <SkeletonSpan />
);
