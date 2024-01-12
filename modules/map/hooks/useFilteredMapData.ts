import { useMemo } from 'react'

import { MapFilters } from '@/modules/map/constants'
import { ProcessedMapData } from '@/modules/map/hooks/useProcessedArcgisData'

export const useFilteredMapData = (data: ProcessedMapData, filters: MapFilters) => {
  return useMemo(() => {
    const filteredData = { ...data }
    if (filteredData.markersData) {
      filteredData.markersData = {
        ...filteredData.markersData,
        features: filteredData.markersData.features.filter(
          (feature) => filters[feature.properties.icon] === 'true',
        ),
      }
    }
    if (filteredData.udrData) {
      filteredData.udrData = {
        ...filteredData.udrData,
        features: filteredData.udrData.features.filter(
          (feature) => filters[feature.properties.status] === 'true',
        ),
      }
    }

    return filteredData
  }, [data, filters])
}
