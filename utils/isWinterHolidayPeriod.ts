/**
 * The function checks if it is winter holiday period from first of December to sixth of January
 * @returns {boolean} - true if it is winter holiday period, false otherwise
 */
export const isWinterHolidayPeriod = () => {
  const today = new Date()
  const month = today.getMonth()
  const date = today.getDate()

  return month === 11 || (month === 0 && date <= 6)
}
