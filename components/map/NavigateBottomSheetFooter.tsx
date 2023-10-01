import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet'
import * as Linking from 'expo-linking'
import { useCallback } from 'react'
import { View, ViewProps } from 'react-native'

import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

type Props = BottomSheetFooterProps & {
  onLayout: ViewProps['onLayout']
  navigationUrl: string
}

const NavigateBottomSheetFooter = ({ onLayout, navigationUrl, ...restProps }: Props) => {
  const t = useTranslation('MapScreen.PointBottomSheet')
  const handlePress = useCallback(() => {
    Linking.openURL(navigationUrl).catch((error) => console.warn(error))
  }, [navigationUrl])

  return (
    <BottomSheetFooter {...restProps}>
      <View onLayout={onLayout} className="px-5 pb-3">
        <Button startIcon="directions" variant="primary" className="" onPress={handlePress}>
          {t('getDirections')}
        </Button>
        <View className="h-[29px]" aria-hidden />
      </View>
    </BottomSheetFooter>
  )
}

export default NavigateBottomSheetFooter
