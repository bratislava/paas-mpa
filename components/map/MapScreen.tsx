import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import Map from '@/components/map/Map'
import MapPointBottomSheet from '@/components/map/MapPointBottomSheet'
import MapZoneBottomSheet from '@/components/map/MapZoneBottomSheet'
import { DEFAULT_FILTERS, MapFilters } from '@/modules/map/constants'
import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'

const MapScreen = () => {
  const [selectedZone, setSelectedZone] = useState<MapUdrZone | null>(null)
  const [selectedPoint, setMapInterestPoint] = useState<MapInterestPoint | null>(null)
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS)
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const pointBottomSheetRef = useRef<BottomSheet>(null)
  const handleZoneChange = useCallback(
    (zone: MapUdrZone) => {
      setSelectedZone(zone)
      zoneBottomSheetRef.current?.snapToIndex(0)
    },
    [setSelectedZone],
  )
  const handlePointPress = useCallback(
    (zone: MapInterestPoint) => {
      setMapInterestPoint(zone)
      zoneBottomSheetRef.current?.snapToIndex(0)
    },
    [setMapInterestPoint],
  )

  return (
    <View className="flex-1 items-stretch">
      <Map onZoneChange={handleZoneChange} onPointPress={handlePointPress} filters={filters} />
      <MapZoneBottomSheet ref={zoneBottomSheetRef} zone={selectedZone} />
      {selectedPoint && <MapPointBottomSheet ref={pointBottomSheetRef} point={selectedPoint} />}
    </View>
  )
}

export default MapScreen
