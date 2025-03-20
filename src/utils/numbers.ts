import Decimal from "decimal.js";

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
  decimals?: { min?: number; max?: number }
) =>
  formatNumber(
    value,
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals?.min,
      maximumFractionDigits: decimals?.max,
    })
  );

export const formatCurrencyWithDecimals = (
  currencyName: string,
  value?: IDecimal | null,
  decimals?: { min?: number; max?: number }
) => `${formatNumberWithDecimals(value, decimals)} ${currencyName}`;

export const parseNumberOrDefault = (number: any, defaultNumber: number) =>
  Number(number ?? "invalid") || defaultNumber;
