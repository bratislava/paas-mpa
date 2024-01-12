import { useMemo } from 'react'

import { useLocale } from '@/hooks/useTranslation'
import { MapUdrZone, UdrZoneFeature } from '@/modules/map/types'
import { translateMapObject } from '@/modules/map/utils/translateMapObject'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'

export function useMapZone<PropertiesOnly extends boolean>(
  udrId: string | null,
  propertiesOnly: PropertiesOnly,
): (PropertiesOnly extends true ? MapUdrZone : UdrZoneFeature) | null
export function useMapZone(
  udrId: string | null,
  propertiesOnly: boolean = false,
): MapUdrZone | UdrZoneFeature | null {
  const mapZones = useMapZonesContext()
  const locale = useLocale()

  return useMemo(() => {
    if (!udrId || !mapZones) {
      return null
    }

    const mapZone = mapZones.get(udrId) ?? null

    if (propertiesOnly) {
      if (mapZone?.properties) {
        return translateMapObject(mapZone.properties, locale)
      }

      return null
    }

    return mapZone
  }, [udrId, mapZones, propertiesOnly, locale])
}
