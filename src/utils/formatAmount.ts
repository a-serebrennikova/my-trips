import { CURRENCY, Currency } from "../types";

export const ratingFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const formatAmount = (amount: number, currency: Currency) => {
  const symbol = CURRENCY[currency];
  return `${ratingFormatter.format(amount)} ${symbol}`;
};
