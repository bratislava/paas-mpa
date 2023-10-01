import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import Map from '@/components/map/Map'
import { SelectedPoint, SelectedUdrZone } from '@/modules/map/types'

import MapPointBottomSheet from './MapPointBottomSheet'
import MapZoneBottomSheet from './MapZoneBottomSheet'

const MapScreen = () => {
  const [selectedZone, setSelectedZone] = useState<SelectedUdrZone | null>(null)
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null)
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const pointBottomSheetRef = useRef<BottomSheet>(null)
  const handleZoneChange = useCallback(
    (zone: SelectedUdrZone) => {
      setSelectedZone(zone)
      zoneBottomSheetRef.current?.snapToIndex(0)
    },
    [setSelectedZone],
  )
  const handlePointPress = useCallback(
    (zone: SelectedPoint) => {
      setSelectedPoint(zone)
      zoneBottomSheetRef.current?.snapToIndex(0)
    },
    [setSelectedPoint],
  )

  return (
    <View className="flex-1 items-stretch">
      <Map onZoneChange={handleZoneChange} onPointPress={handlePointPress} />
      <MapZoneBottomSheet ref={zoneBottomSheetRef} zone={selectedZone} />
      {selectedPoint && <MapPointBottomSheet ref={pointBottomSheetRef} point={selectedPoint} />}
    </View>
  )
}

export default MapScreen
