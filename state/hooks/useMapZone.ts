import { Feature, Polygon } from 'geojson'
import { useMemo } from 'react'

import { useLocale } from '@/hooks/useTranslation'
import { MapUdrZone, NormalizedUdrZone } from '@/modules/map/types'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'

export function useMapZone<NormalizePropertiesOnly extends boolean>(
  id: number | string | null,
  normalizedPropertiesOnly: NormalizePropertiesOnly,
): (NormalizePropertiesOnly extends true ? NormalizedUdrZone : Feature<Polygon, MapUdrZone>) | null
export function useMapZone(
  id: number | string | null,
  normalizedPropertiesOnly: boolean = false,
): NormalizedUdrZone | Feature<Polygon, MapUdrZone> | null {
  const globalStore = useGlobalStoreContext()
  const locale = useLocale()

  return useMemo(() => {
    if (id === null) return null
    const mapZone =
      globalStore.mapZones?.get(typeof id === 'string' ? Number.parseInt(id, 10) : id) ?? null
    if (normalizedPropertiesOnly) {
      if (mapZone?.properties) return normalizeZone(mapZone.properties, locale)

      return null
    }

    return mapZone
  }, [id, globalStore, normalizedPropertiesOnly, locale])
}
