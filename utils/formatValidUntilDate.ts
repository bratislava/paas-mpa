/**
 * Formats the validUntil date to the last included date in the format dd.MM.yyyy
 * @param validUntil example: 2025-12-30T22:00:00.000Z
 * @returns 30.12.2022
 */
export const formatValidUntilDate = (validUntil: string, locale: string) => {
  // We subtract one minute because after localization the validUntil is 00:00 and we show last included date
  const time = new Date(validUntil).getTime() - 1 * 1000

  return new Date(time).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
}
