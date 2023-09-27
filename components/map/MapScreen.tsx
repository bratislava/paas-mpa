/* eslint-disable @typescript-eslint/no-unused-vars */
import BottomSheet from '@gorhom/bottom-sheet'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import Map from '@/components/map/Map'
import Typography from '@/components/shared/Typography'

const MapScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bottomSheetContent, setBottomSheetContent] = useState<any>(null)
  const handleBottomSheetChange = useCallback(
    (content: any) => {
      setBottomSheetContent(content)
    },
    [setBottomSheetContent],
  )

  // const udrDataByPrice = useMemo(
  //   () => ({
  //     udrDataRegular: {
  //       ...udrData,
  //       features: udrData?.features.filter((udr) => udr.properties?.Zakladna_cena !== 2),
  //     } as FeatureCollection,
  //     udrDataTwoEur: {
  //       ...udrData,
  //       features: udrData?.features.filter((udr) => udr.properties?.Zakladna_cena === 2),
  //     } as FeatureCollection,
  //   }),
  //   [udrData],
  // )

  return (
    <View className="flex-1 items-stretch">
      <Map onBottomSheetContentChange={handleBottomSheetChange} />
      {bottomSheetContent && (
        <BottomSheet snapPoints={['20%', '80%']}>
          <View className="bg-white">
            <Typography>{JSON.stringify(bottomSheetContent)}</Typography>
            {/* <Button onPress={() => setBottomSheetContent(null)}>Close</Button> */}
          </View>
        </BottomSheet>
      )}
    </View>
  )
}

export default MapScreen
