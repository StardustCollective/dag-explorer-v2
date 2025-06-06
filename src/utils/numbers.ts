import Decimal from "decimal.js";
import { millify } from "millify";

export const encodeDecimal = <T extends IDecimal | undefined | null>(
  value: T
) => {
  if (value === undefined || value === null) {
    return value as T extends IDecimal ? Exclude<IDecimal, Decimal> : T;
  }

  return new Decimal(value).toFixed() as T extends IDecimal
    ? Exclude<IDecimal, Decimal>
    : T;
};

export const decodeDecimal = <T extends IDecimal | undefined | null>(
  value: T
): T extends IDecimal ? Decimal : T => {
  if (value === undefined || value === null) {
    return value as T extends IDecimal ? Decimal : T;
  }

  return new Decimal(value) as T extends IDecimal ? Decimal : T;
};

export const formatNumber = (
  value?: IDecimal | null,
  formatter?: Intl.NumberFormat
) => {
  formatter =
    formatter ??
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });

  value = value ?? 0;
  value = typeof value === "string" ? new Decimal(value) : value;
  value = Decimal.isDecimal(value) ? value : new Decimal(value);

  const fixedValue = value.toFixed() as Intl.StringNumericLiteral;
  return formatter.format(fixedValue);
};

export const formatNumberWithDecimals = (
  value?: IDecimal | null,
  options?: { minD?: number; maxD?: number; millifyFrom?: number }
) => {
  if (
    typeof options?.millifyFrom === "number" &&
    new Decimal(value ?? 0).gte(options.millifyFrom)
  ) {
    return millify(new Decimal(value ?? 0).toNumber(), {
      locales: "en-US",
      precision: options?.maxD,
    });
  }

  return formatNumber(
    value,
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: options?.minD,
      maximumFractionDigits: options?.maxD ?? 8,
    })
  );
};

export const formatCurrencyWithDecimals = (
  currencyName: string,
  value?: IDecimal | null,
  options?: { minD?: number; maxD?: number; millifyFrom?: number }
) => `${formatNumberWithDecimals(value, options)} ${currencyName}`;

export const parseNumberOrDefault = (number: any, defaultNumber: number) =>
  Number(number ?? "invalid") || defaultNumber;

export const isHexNumber = (value: string, length?: number) => {
  return [
    /^[0-9a-fA-F]+$/.test(value),
    length ? value.length === length : true,
  ].every((b) => b);
};

export const isDecNumber = (value: string, length?: number) => {
  return [
    /^[0-9]+$/.test(value),
    length ? value.length === length : true,
  ].every((b) => b);
};
