import BottomSheet from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import { forwardRef, useCallback, useRef } from 'react'
import { TextInput as RNTextInput, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

import TextInput from '@/components/inputs/TextInput'
import { MapRef } from '@/components/map/Map'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import MapZoneBottomSheetPanel from '@/components/map/MapZoneBottomSheetPanel'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { MapUdrZone } from '@/modules/map/types'
import { cn } from '@/utils/cn'

type Props = {
  zone: MapUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
  isZoomedOut?: boolean
  address?: string
}

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone: selectedZone, setFlyToCenter, isZoomedOut, address } = props

  const inputRef = useRef<RNTextInput>(null)

  const t = useTranslation('ZoneBottomSheet')

  const handleInputFocus = useCallback(() => {
    router.push('/search')
  }, [])

  const animatedPosition = useSharedValue(0)

  return (
    <>
      <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />
      <BottomSheet
        key="mapZoneBottomSheet"
        ref={ref}
        keyboardBehavior="interactive"
        handleComponent={BottomSheetHandleWithShadow}
        animatedPosition={animatedPosition}
        enableDynamicSizing
      >
        <BottomSheetContent isDynamic className={cn('bg-white', selectedZone ? 'g-2' : 'g-3')}>
          {isZoomedOut ? (
            <View className="flex-col items-center">
              <Typography className="text-center">{t('zoomIn')}</Typography>
            </View>
          ) : (
            <>
              <Field label={t('title')}>
                <PressableStyled onPress={handleInputFocus}>
                  <TextInput
                    pointerEvents="none"
                    ref={inputRef}
                    accessibilityLabel={t('searchAccessibilityInput')}
                    returnKeyType="search"
                    value={address}
                    selection={{ start: 0 }}
                  />
                </PressableStyled>
              </Field>
              <MapZoneBottomSheetPanel selectedZone={selectedZone} />
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
})

export default MapZoneBottomSheet
