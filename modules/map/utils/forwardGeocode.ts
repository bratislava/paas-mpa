import axios from 'axios'

import { environment } from '@/environment'
import { GeocodingFeature } from '@/modules/arcgis/types'
import { CITY_BOUNDS } from '@/modules/map/constants'

export const forwardGeocode = async (text: string) => {
  const accessToken = environment.mapboxPublicKey
  const limit = 15
  const bbox = [...CITY_BOUNDS.sw, ...CITY_BOUNDS.ne].join(',')
  const result = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      text,
    )}.json?limit=${limit}&bbox=${bbox}&access_token=${accessToken}`,
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return result.data?.features as GeocodingFeature[]
}
