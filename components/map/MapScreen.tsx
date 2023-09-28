/* eslint-disable @typescript-eslint/no-unused-vars */
import BottomSheet from '@gorhom/bottom-sheet'
import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'

import Map from '@/components/map/Map'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Typography from '@/components/shared/Typography'

const MapScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bottomSheetContent, setBottomSheetContent] = useState<any>(null)
  const handleBottomSheetChange = useCallback(
    (content: string | null) => {
      setBottomSheetContent(content)
    },
    [setBottomSheetContent],
  )

  const snapPoints = useMemo(() => ['20%', '80%'], [])

  return (
    <View className="flex-1 items-stretch">
      <Map onBottomSheetContentChange={handleBottomSheetChange} />
      {bottomSheetContent && (
        <BottomSheet snapPoints={snapPoints}>
          <BottomSheetContent>
            <View className="bg-white">
              <Typography>{JSON.stringify(bottomSheetContent)}</Typography>
              {/* <Button onPress={() => setBottomSheetContent(null)}>Close</Button> */}
            </View>
          </BottomSheetContent>
        </BottomSheet>
      )}
    </View>
  )
}

export default MapScreen
