import Decimal from "decimal.js";

declare global {
  /**
   * A representation of a decimal number, which should be encodable to a Decimal.js instance
   */
  type IDecimal = string | number | Decimal;
}
