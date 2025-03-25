import React from "react";

import { SkeletonSpan } from "../SkeletonSpan";
import { SuspenseValue } from "../SuspenseValue";

import { formatNumberWithDecimals } from "@/utils";

export type IFormatCurrencyProps = {
  value: IDecimal;
  currency: Promise<React.ReactNode> | React.ReactNode;
  decimals?: { min?: number; max?: number };
};

export const FormatCurrency = ({
  value,
  currency,
  decimals,
}: IFormatCurrencyProps) => {
  return (
    <span>
      {formatNumberWithDecimals(value, decimals)}{" "}
      <SuspenseValue fallback={<SkeletonSpan />} value={currency} />
    </span>
  );
};
