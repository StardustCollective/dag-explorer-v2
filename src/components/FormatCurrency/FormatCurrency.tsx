import clsx from "clsx";
import React, { use } from "react";

import { FormatCurrencySymbol } from "./FormatCurrencySymbol";

import { formatNumberWithDecimals, isPromiseLike, withSuspense } from "@/utils";

export type IFormatCurrencyProps = {
  value: Promise<IDecimal> | IDecimal;
  currency: Promise<React.ReactNode> | React.ReactNode;
  isDatum?: boolean;
  decimals?: { min?: number; max?: number };
  millifyFrom?: number;
  className?: string;
};

export const FormatCurrency = withSuspense(
  function FormatCurrency({
    value: valuePromise,
    currency,
    isDatum,
    decimals,
    millifyFrom,
    className,
  }: IFormatCurrencyProps) {
    const value = isPromiseLike(valuePromise)
      ? use(valuePromise)
      : valuePromise;

    return (
      <span
        className={clsx(
          "inline-flex flex-nowrap items-center gap-1",
          className
        )}
      >
        {formatNumberWithDecimals(value, {
          minD: decimals?.min,
          maxD: decimals?.max,
          millifyFrom: millifyFrom,
        })}{" "}
        <FormatCurrencySymbol currency={currency} isDatum={isDatum} />
      </span>
    );
  },
  ({ currency }) => (
    <>
      -- <FormatCurrencySymbol currency={currency} />
    </>
  )
);
