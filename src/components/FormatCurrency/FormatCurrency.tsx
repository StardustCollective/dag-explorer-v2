import clsx from "clsx";
import React, { use } from "react";


import { FormatCurrencySymbol } from "./FormatCurrencySymbol";

import {
  formatNumberWithDecimals,
  isPromiseLike,
  withSuspense,
} from "@/utils";

export type IFormatCurrencyProps = {
  value: Promise<IDecimal> | IDecimal;
  currency: Promise<React.ReactNode> | React.ReactNode;
  decimals?: { min?: number; max?: number };
  className?: string;
};

export const FormatCurrency = withSuspense(
  function FormatCurrency({
    value: valuePromise,
    currency,
    decimals,
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
        {formatNumberWithDecimals(value, decimals)}{" "}
        <FormatCurrencySymbol currency={currency} />
      </span>
    );
  },
  ({ currency }) => (
    <>
      -- <FormatCurrencySymbol currency={currency} />
    </>
  )
);
