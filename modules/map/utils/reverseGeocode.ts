import axios from 'axios'
import { Position } from 'geojson'

import { environment } from '@/environment'
import { GeocodingFeature } from '@/modules/arcgis/types'

export const reverseGeocode = async (position: Position) => {
  const [lon, lat] = position
  const accessToken = environment.mapboxPublicKey
  const limit = 1
  const result = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?limit=${limit}&coutry=sk&access_token=${accessToken}`,
  )

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return result.data?.features as GeocodingFeature[]
}
