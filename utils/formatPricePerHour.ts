/**
 * Returns price per hour in format without decimal places if not needed. Uses decimal point/comma depending on locale.
 * Note: We don't use `style: 'currency' to keep € symbol at the end for simplicity.
 * Example: 1 € / h, 1.5 € / h, 2 € / h
 *
 * @param price
 * @param locale
 */
export const formatPricePerHour = (price: number, locale: string) => {
  return `${price.toLocaleString(locale, {
    maximumFractionDigits: 2,
  })} € / h`
}
