import React from "react";

import { SuspenseValue } from "../SuspenseValue";

import { HgtpNetwork } from "@/common/consts";
import { getKnownUsdPrice } from "@/common/currencies";
import {
  decodeDecimal,
  encodeDecimal,
  formatNumberWithDecimals,
  isPromiseLike,
} from "@/utils";

export type IFormatCurrencyPriceProps = {
  network: HgtpNetwork;
  currencyId?: string;
  value: Promise<IDecimal> | IDecimal;
  decimals?: { min?: number; max?: number };
  className?: string;
};

export const FormatCurrencyPrice = async ({
  network,
  currencyId,
  value,
  decimals = { max: 2 },
  className,
}: IFormatCurrencyPriceProps) => {
  const price = getKnownUsdPrice(network, currencyId);

  return (
    <SuspenseValue
      className={className}
      fallback={""}
      value={Promise.all([
        price,
        isPromiseLike(value) ? value : Promise.resolve(value),
      ]).then(([price, value]) =>
        price === null ? null : (
          <>
            ($
            {formatNumberWithDecimals(
              encodeDecimal(decodeDecimal(value).mul(price)),
              decimals
            )}{" "}
            USD)
          </>
        )
      )}
    />
  );
};
