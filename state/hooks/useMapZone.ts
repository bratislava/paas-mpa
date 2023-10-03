import { Feature, Polygon } from 'geojson'
import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { NormalizedUdrZone, SelectedUdrZone } from '@/modules/map/types'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'

import { GlobalStoreContext } from '../GlobalStoreProvider'

export function useMapZone<NormalizePropertiesOnly extends boolean>(
  id: number,
  normalizedPropertiesOnly: NormalizePropertiesOnly,
):
  | (NormalizePropertiesOnly extends true ? NormalizedUdrZone : Feature<Polygon, SelectedUdrZone>)
  | null
export function useMapZone(
  id: number,
  normalizedPropertiesOnly: boolean = false,
): NormalizedUdrZone | Feature<Polygon, SelectedUdrZone> | null {
  const globalStore = useContext(GlobalStoreContext)
  const [, i18n] = useTranslation()

  return useMemo(() => {
    const mapZone = (globalStore.mapFeatures?.get(id) ?? null) as Feature<
      Polygon,
      SelectedUdrZone
    > | null
    if (normalizedPropertiesOnly) {
      if (mapZone?.properties) return normalizeZone(mapZone.properties, i18n.language)

      return null
    }

    return mapZone
  }, [id, globalStore, normalizedPropertiesOnly, i18n.language])
}
