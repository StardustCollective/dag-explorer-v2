"use client";

import clsx from "clsx";
import React from "react";
import { NumericFormat } from "react-number-format";

import { decodeDecimal, encodeDecimal } from "@/utils";

export type IAmountInputProps = {
  title?: React.ReactNode;
  caption?: React.ReactNode;
  valueChildren?: React.ReactNode;
  error?: boolean;
  currency?: string;
  value?: IDecimal;
  maxValue?: IDecimal;
  minValue?: IDecimal;
  onValueChange?: (amount: IDecimal) => void;
};

export const AmountInput = ({
  title,
  caption,
  valueChildren,
  error,
  currency = "DAG",
  value,
  maxValue = Infinity,
  minValue = -Infinity,
  onValueChange,
}: IAmountInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 text-gray-600 font-semibold text-xs">
        {title}
      </div>
      <div
        className={clsx(
          "flex flex-row flex-nowrap gap-2 px-4 py-3 bg-cfff/50 border-[1.5px] border-cef6 rounded-lg",
          error && "border-red-500 text-red-500 bg-red-50/50"
        )}
      >
        <div className="flex flex-col grow gap-0.5">
          <NumericFormat
            displayType="input"
            className={clsx(
              "font-medium bg-transparent outline-hidden border-none",
              error && "text-red-500"
            )}
            suffix={" " + currency}
            decimalScale={8}
            allowNegative={false}
            decimalSeparator="."
            thousandSeparator=","
            value={encodeDecimal(value)}
            onValueChange={(values, source) => {
              if (
                !(
                  source.source === "event" &&
                  onValueChange &&
                  typeof values.floatValue === "number"
                )
              ) {
                return;
              }

              if (values.floatValue > decodeDecimal(maxValue).toNumber()) {
                onValueChange(encodeDecimal(maxValue));
                return;
              }

              if (values.floatValue < decodeDecimal(minValue).toNumber()) {
                onValueChange(encodeDecimal(minValue));
                return;
              }

              onValueChange(encodeDecimal(values.floatValue));
            }}
          />
        </div>
        {valueChildren && (
          <div className="flex items-center gap-2 ml-auto">{valueChildren}</div>
        )}
      </div>
      {caption && (
        <span className="flex flex-row flex-nowrap items-center gap-1.5 text-xs">
          {caption}
        </span>
      )}
    </div>
  );
};
