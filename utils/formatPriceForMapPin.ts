/**
 * Returns price for MapPin component in format without decimal places if not needed. Uses decimal point/comma depending on locale.
 * Note: We don't use `style: 'currency' to keep € symbol at the end for simplicity.
 * Example: 1 €, 1.5 €, 2 €
 *
 * @param price
 * @param locale
 */
export const formatPriceForMapPin = (price: number, locale: string) => {
  return `${price.toLocaleString(locale, {
    maximumFractionDigits: 2,
  })} €`
}
