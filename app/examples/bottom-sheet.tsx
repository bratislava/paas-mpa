import BottomSheet from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import SegmentBadge from '@/components/info/SegmentBadge'
import TextInput from '@/components/inputs/TextInput'
import BottomSheetContent from '@/components/shared/BottomSheetContent'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import FlexRow from '@/components/shared/FlexRow'
import Panel from '@/components/shared/Panel'
import ScreenView from '@/components/shared/ScreenView'
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
              <Panel className="g-4">
                <FlexRow>
                  <Typography>Fazuľová + Školská</Typography>
                  <SegmentBadge label="1009" />
                </FlexRow>
                <Divider />
                <FlexRow>
                  <Typography variant="default-bold">2€ / h</Typography>
                  <Typography variant="default-bold">Show details</Typography>
                </FlexRow>
              </Panel>
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
