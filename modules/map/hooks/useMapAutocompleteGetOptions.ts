import { useCallback } from 'react'

import { UdrZoneFeature } from '@/modules/map/types'
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
  const mapZones = useMapZonesContext()

  return useCallback(
    async (
      input: string,
    ): Promise<[UdrZoneFeature[], Unpromise<ReturnType<typeof forwardGeocode>>]> => {
      const filteredMapZones: UdrZoneFeature[] = []
      if (mapZones && input) {
        const normalizedInput = normalizeString(input)
        mapZones.forEach((zone) => {
          if (
            normalizeString(zone.properties.name).includes(normalizedInput) ||
            normalizeString(zone.properties.udrId.toString()).includes(normalizedInput)
          ) {
            filteredMapZones.push(zone)
          }
        })
      }

      return [
        filteredMapZones.sort(
          (a, b) =>
            Number.parseInt(a.properties.udrId, 10) - Number.parseInt(b.properties.udrId, 10),
        ),
        await forwardGeocode(input),
      ]
    },
    [mapZones],
  )
}
