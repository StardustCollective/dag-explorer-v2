import React from "react";

import { SkeletonSpan } from "../SkeletonSpan";
import { SuspenseValue } from "../SuspenseValue";

import { formatNumberWithDecimals, isPromiseLike } from "@/utils";

export type IFormatCurrencyProps = {
  value: Promise<IDecimal> | IDecimal;
  currency: Promise<React.ReactNode> | React.ReactNode;
  decimals?: { min?: number; max?: number };
  className?: string;
};

export const FormatCurrency = ({
  value,
  currency,
  decimals,
  className,
}: IFormatCurrencyProps) => {
  return (
    <SuspenseValue
      className={className}
      fallback={""}
      value={(isPromiseLike(value) ? value : Promise.resolve(value)).then(
        (value) => (
          <>
            {formatNumberWithDecimals(value, decimals)}{" "}
            <SuspenseValue fallback={<SkeletonSpan />} value={currency} />
          </>
        )
      )}
    />
  );
};
