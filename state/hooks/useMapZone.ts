import { Feature, Polygon } from 'geojson'
import { useMemo } from 'react'

import { useLocale } from '@/hooks/useTranslation'
import { MapUdrZone, NormalizedUdrZone } from '@/modules/map/types'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'
import { isFeatureZone } from '@/state/types'

export function useMapZone<NormalizePropertiesOnly extends boolean>(
  id: number | null,
  normalizedPropertiesOnly: NormalizePropertiesOnly,
): (NormalizePropertiesOnly extends true ? NormalizedUdrZone : Feature<Polygon, MapUdrZone>) | null
export function useMapZone(
  id: number | null,
  normalizedPropertiesOnly: boolean = false,
): NormalizedUdrZone | Feature<Polygon, MapUdrZone> | null {
  const globalStore = useGlobalStoreContext()
  const locale = useLocale()

  return useMemo(() => {
    if (id === null) return null
    const mapZone = globalStore.mapFeatures?.get(id) ?? null
    if (isFeatureZone(mapZone)) {
      if (normalizedPropertiesOnly) {
        if (mapZone?.properties) return normalizeZone(mapZone.properties, locale)

        return null
      }

      return mapZone
    }

    return null
  }, [id, globalStore, normalizedPropertiesOnly, locale])
}
