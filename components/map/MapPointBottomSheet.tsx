import BottomSheet from '@gorhom/bottom-sheet'
import { forwardRef, useMemo } from 'react'
import { View } from 'react-native'

import BottomSheetContent from '@/components/shared/BottomSheetContent'
import { useTranslation } from '@/hooks/useTranslation'
import { SelectedPoint } from '@/modules/map/types'

import Icon from '../shared/Icon'
import Typography from '../shared/Typography'

type Props = {
  point: SelectedPoint
}

const MapPointBottomSheet = forwardRef<BottomSheet, Props>(({ point }, ref) => {
  const t = useTranslation('MapScreen.PointBottomSheet')

  const snapPoints = useMemo(() => ['50%', '80%'], [])

  console.log(point)

  return (
    <BottomSheet ref={ref} enablePanDownToClose snapPoints={snapPoints}>
      <BottomSheetContent cn="bg-white">
        <View className="border-b-divider">
          <Icon name="close" />
          <Typography variant="h1">{t('title')}</Typography>
        </View>
      </BottomSheetContent>
    </BottomSheet>
  )
})

export default MapPointBottomSheet
