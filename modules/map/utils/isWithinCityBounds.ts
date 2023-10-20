import { LocationObject } from 'expo-location'

import { CITY_BOUNDS } from '@/modules/map/constants'

export const isWithinCityBounds = (location: LocationObject | null) => {
  if (!location) return false
  const position = [location.coords.longitude, location.coords.latitude]
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (
    position[0] > CITY_BOUNDS.sw[0] &&
    position[1] > CITY_BOUNDS.sw[1] &&
    position[0] < CITY_BOUNDS.ne[0] &&
    position[1] < CITY_BOUNDS.ne[1]
  )
    return true

  return false
}
