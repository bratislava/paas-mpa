/**
 * Returns price in fixed format with two decimal places. Uses decimal point/comma depending on locale.
 * Note: We don't use `style: 'currency' to keep € symbol at the end for simplicity.
 * Example: 2.05 €
 *
 * @param price
 * @param locale
 */
export const formatPrice = (price: number, locale: string) => {
  return `${price.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`
}
