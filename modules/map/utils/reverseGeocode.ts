import axios from 'axios'
import { Position } from 'geojson'

export const reverseGeocode = async (position: Position) => {
  const [lon, lat] = position

  try {
    const result = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
    )

    if (!result.data) return ''

    return [result.data.address.road, result.data.address.house_number].filter(Boolean).join(' ')
  } catch {
    return ''
  }
}
