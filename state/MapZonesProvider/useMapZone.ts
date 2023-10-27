import { Feature, Polygon } from 'geojson'
import { useMemo } from 'react'

import { useLocale } from '@/hooks/useTranslation'
import { MapUdrZone, NormalizedUdrZone } from '@/modules/map/types'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'

export function useMapZone<NormalizePropertiesOnly extends boolean>(
  udrId: string | null,
  normalizedPropertiesOnly: NormalizePropertiesOnly,
): (NormalizePropertiesOnly extends true ? NormalizedUdrZone : Feature<Polygon, MapUdrZone>) | null
export function useMapZone(
  udrId: string | null,
  normalizedPropertiesOnly: boolean = false,
): NormalizedUdrZone | Feature<Polygon, MapUdrZone> | null {
  const { mapZones } = useMapZonesContext()
  const locale = useLocale()

  return useMemo(() => {
    if (!udrId || !mapZones) {
      return null
    }

    const mapZone = mapZones.get(udrId) ?? null

    if (normalizedPropertiesOnly) {
      if (mapZone?.properties) {
        return normalizeZone(mapZone.properties, locale)
      }

      return null
    }

    return mapZone
  }, [udrId, mapZones, normalizedPropertiesOnly, locale])
}
