import { useMemo } from 'react'

import { MapFilters } from '@/modules/map/constants'
import { ProcessedMapData } from '@/modules/map/hooks/useProcessedMapData'

export const useFilteredMapData = (data: ProcessedMapData, filters: MapFilters) => {
  return useMemo(() => {
    const filteredData = { ...data }
    if (filteredData.markersData) {
      filteredData.markersData = {
        ...filteredData.markersData,
        features: filteredData.markersData.features.filter(
          (feature) => filters[feature.properties.kind] === 'true',
        ),
      }
    }
    if (filteredData.udrData) {
      filteredData.udrData = {
        ...filteredData.udrData,
        features: filteredData.udrData.features.filter(
          (feature) => filters[feature.properties.Status] === 'true',
        ),
      }
    }

    return filteredData
  }, [data, filters])
}
