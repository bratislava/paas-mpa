import Holidays from 'date-holidays'

import { MapUdrZone, MapUdrZoneWithTranslationProps } from '@/modules/map/types'

const holidays = new Holidays('SK')

export const getPriceFromZone = (
  zone: MapUdrZone | MapUdrZoneWithTranslationProps,
  date?: Date,
) => {
  const localDate = date ?? new Date()
  // eslint-disable-next-line eqeqeq
  if (zone.weekendsAndHolidaysPrice == undefined) {
    return zone.price
  }
  if (localDate.getDay() === 6 || localDate.getDay() === 0) {
    return zone.weekendsAndHolidaysPrice
  }
  if (holidays.isHoliday(localDate)) {
    return zone.weekendsAndHolidaysPrice
  }

  return zone.price
}
