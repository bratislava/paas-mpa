import axios from 'axios'
import { Position } from 'geojson'

import { environment } from '@/environment'
import { GeocodingFeature } from '@/modules/arcgis/types'
import { CITY_BOUNDS } from '@/modules/map/constants'

const RESULTS_LIMIT = 1

export const reverseGeocode = async (position: Position) => {
  const [lon, lat] = position

  const bbox = [...CITY_BOUNDS.sw, ...CITY_BOUNDS.ne].join(',')

  const result = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?limit=${RESULTS_LIMIT}&bbox=${bbox}&limit=1&country=sk&access_token=${environment.mapboxPublicKey}`,
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return result.data?.features as GeocodingFeature[]
}
