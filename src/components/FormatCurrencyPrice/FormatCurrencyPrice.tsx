import React, { use } from "react";


import { HgtpNetwork } from "@/common/consts";
import { getKnownUsdPrice } from "@/common/currencies";
import {
  decodeDecimal,
  encodeDecimal,
  formatNumberWithDecimals,
  isPromiseLike,
  withSuspense,
} from "@/utils";

export type IFormatCurrencyPriceProps = {
  network: HgtpNetwork;
  currencyId?: string;
  value: Promise<IDecimal> | IDecimal;
  decimals?: { min?: number; max?: number };
  className?: string;
};

export const FormatCurrencyPrice = withSuspense(
  function FormatCurrencyPrice({
    network,
    currencyId,
    value: valuePromise,
    decimals = { max: 2 },
    className,
  }: IFormatCurrencyPriceProps) {
    const price = use(getKnownUsdPrice(network, currencyId));
    const value = isPromiseLike(valuePromise)
      ? use(valuePromise)
      : valuePromise;

    if (price === null || value === null) {
      return null;
    }

    return (
      <span className={className}>
        ($
        {formatNumberWithDecimals(
          encodeDecimal(decodeDecimal(value).mul(price)),
          decimals
        )}{" "}
        USD)
      </span>
    );
  },
  () => <></>
);
