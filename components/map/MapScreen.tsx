import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'

import Map from '@/components/map/Map'
import { SelectedUdrZone } from '@/modules/map/types'

import MapBottomSheet from './MapBottomSheet'

const MapScreen = () => {
  const [bottomSheetContent, setBottomSheetContent] = useState<SelectedUdrZone>(null)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const handleBottomSheetChange = useCallback(
    (content: SelectedUdrZone) => {
      setBottomSheetContent(content)
      console.log(content)
      bottomSheetRef.current?.snapToIndex(0)
    },
    [setBottomSheetContent],
  )

  return (
    <View className="flex-1 items-stretch">
      <Map onBottomSheetContentChange={handleBottomSheetChange} />
      <MapBottomSheet ref={bottomSheetRef} content={bottomSheetContent} />
    </View>
  )
}

export default MapScreen
