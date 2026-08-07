import { CURRENCY, Currency } from "../types";

export const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const formatAmount = (amount: number, currency: Currency) => {
  const symbol = CURRENCY[currency];
  return `${amountFormatter.format(amount)} ${symbol}`;
};
