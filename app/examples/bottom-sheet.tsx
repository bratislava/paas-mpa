import BottomSheet from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import SegmentBadge from '@/components/info/SegmentBadge'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import ScreenView from '@/components/shared/ScreenView'
import Surface from '@/components/shared/Surface'
import Typography from '@/components/shared/Typography'

const Page = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['25%', '50%'], [])

  const [showSegmentDetail, setShowSegmentDetail] = useState(false)

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 1) {
      setShowSegmentDetail(true)
    } else {
      setShowSegmentDetail(false)
    }
    console.log('handleSheetChanges', index)
  }, [])

  return (
    <ScreenView backgroundVariant="dots">
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetContent cn="g-5">
          <Field label="Where are you parking?">
            <TextInput />
          </Field>
          {showSegmentDetail && (
            <>
              <Surface surfaceClassName="g-4">
                <View className="flex-row justify-between">
                  <Typography>Fazuľová + Školská</Typography>
                  <SegmentBadge label="1009" />
                </View>
                <Divider />
                <View className="flex-row justify-between">
                  <Typography variant="default-bold">2€ / h</Typography>
                  <Typography variant="default-bold">Show details</Typography>
                </View>
              </Surface>
              <Typography>
                This is just a working example without proper styling and functionality.
              </Typography>
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </ScreenView>
  )
}

export default Page
