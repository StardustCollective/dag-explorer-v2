import Decimal from "decimal.js";

export const formatNumber = (
  value?: string | Decimal | number | null,
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
  value?: string | Decimal | number | null,
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
  value?: string | Decimal | number | null,
  decimals?: { min?: number; max?: number }
) => `${formatNumberWithDecimals(value, decimals)} ${currencyName}`;

export const parseNumberOrDefault = (number: any, defaultNumber: number) =>
  Number(number ?? "invalid") || defaultNumber;
