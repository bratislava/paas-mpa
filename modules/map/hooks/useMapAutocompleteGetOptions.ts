import { Feature, Polygon } from 'geojson'
import { useCallback } from 'react'

import { MapUdrZone } from '@/modules/map/types'
import { forwardGeocode } from '@/modules/map/utils/forwardGeocode'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'
import { Unpromise } from '@/utils/types'

/** This function removes the diacritical marks from the string and changes it to lower-case */
const normalizeString = (str: string) =>
  str
    // normalize into a form where letters are separate unicode characters from diacritical marks
    .normalize('NFD')
    // remove the diacritical marks
    .replaceAll(/[\u0300-\u036F]/g, '')
    .toLowerCase()

export const useMapAutocompleteGetOptions = () => {
  const { mapZones } = useMapZonesContext()

  return useCallback(
    async (
      input: string,
    ): Promise<[Feature<Polygon, MapUdrZone>[], Unpromise<ReturnType<typeof forwardGeocode>>]> => {
      const filteredMapZones: Feature<Polygon, MapUdrZone>[] = []
      if (mapZones && input) {
        const normalizedInput = normalizeString(input)
        mapZones.forEach((zone) => {
          if (
            normalizeString(zone.properties.Nazov).includes(normalizedInput) ||
            normalizeString(zone.properties.UDR_ID.toString()).includes(normalizedInput)
          ) {
            filteredMapZones.push(zone)
          }
        })
      }

      return [
        filteredMapZones.sort((a, b) => a.properties.UDR_ID - b.properties.UDR_ID),
        await forwardGeocode(input),
      ]
    },
    [mapZones],
  )
}
