import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import Map from '@/components/map/Map'
import { SelectedUdrZone } from '@/modules/map/types'

import MapZoneBottomSheet from './MapZoneBottomSheet'

const MapScreen = () => {
  const [selectedZone, setSelectedZone] = useState<SelectedUdrZone>(null)
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const handleZoneChange = useCallback(
    (content: SelectedUdrZone) => {
      setSelectedZone(content)
      console.log(content)
      zoneBottomSheetRef.current?.snapToIndex(0)
    },
    [setSelectedZone],
  )

  return (
    <View className="flex-1 items-stretch">
      <Map onZoneChange={handleZoneChange} />
      <MapZoneBottomSheet ref={zoneBottomSheetRef} zone={selectedZone} />
    </View>
  )
}

export default MapScreen
