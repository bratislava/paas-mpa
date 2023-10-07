import axios from 'axios'

import { environment } from '@/environment'
import { CITY_BOUNDS } from '@/modules/map/constants'
import { GeocodingFeature } from '@/modules/map/types'

export const forwardGeocode = async (text: string) => {
  const accessToken = environment.mapboxPublicKey
  const limit = 3
  const bbox = [...CITY_BOUNDS.sw, ...CITY_BOUNDS.ne].join(',')
  const result = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      text,
    )}.json?limit=${limit}&bbox=${bbox}&access_token=${accessToken}`,
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return result.data?.features as GeocodingFeature[]
}
