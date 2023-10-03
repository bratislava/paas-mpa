import { Feature, Polygon } from 'geojson'
import { useContext, useMemo } from 'react'

import { SelectedUdrZone } from '@/modules/map/types'

import { GlobalStoreContext } from '../GlobalStoreProvider'

export function useMapZone<PropertiesOnly extends boolean>(
  id: number,
  propertiesOnly: PropertiesOnly,
): (PropertiesOnly extends true ? SelectedUdrZone : Feature<Polygon, SelectedUdrZone>) | null
export function useMapZone(
  id: number,
  propertiesOnly: boolean = false,
): SelectedUdrZone | Feature<Polygon, SelectedUdrZone> | null {
  const globalStore = useContext(GlobalStoreContext)

  return useMemo(() => {
    const mapZone = (globalStore.mapFeatures?.get(id) ?? null) as Feature<
      Polygon,
      SelectedUdrZone
    > | null
    if (propertiesOnly) {
      return mapZone?.properties ?? null
    }

    return mapZone
  }, [id, globalStore, propertiesOnly])
}
