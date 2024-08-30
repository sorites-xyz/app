export const formatCurrencyShort = (
  value: number,
  currency = "USD",
  locale = "en-US",
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  }).format(value);
};
