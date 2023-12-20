import BottomSheet from '@gorhom/bottom-sheet'
import clsx from 'clsx'
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
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { NormalizedUdrZone } from '@/modules/map/types'

type Props = {
  zone: NormalizedUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
  isZoomedOut?: boolean
  address?: string
}

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone: selectedZone, setFlyToCenter, isZoomedOut, address } = props

  const localRef = useRef<BottomSheet>(null)
  const inputRef = useRef<RNTextInput>(null)
  const refSetter = useMultipleRefsSetter(ref, localRef)

  const t = useTranslation('ZoneBottomSheet')

  const handleInputFocus = useCallback(() => {
    router.push('/search')
  }, [])

  const animatedPosition = useSharedValue(0)

  return (
    <>
      <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />
      <BottomSheet
        ref={refSetter}
        keyboardBehavior="interactive"
        handleComponent={BottomSheetHandleWithShadow}
        animatedPosition={animatedPosition}
        enableDynamicSizing
      >
        <BottomSheetContent cn={clsx('bg-white', selectedZone ? 'g-2' : 'g-3')}>
          {isZoomedOut ? (
            <View className="flex-col items-center">
              <Typography className="text-center">{t('zoomIn')}</Typography>
            </View>
          ) : (
            <>
              <View>
                <Typography variant="default-bold" className="pb-1">
                  {t('title')}
                </Typography>
                <PressableStyled onPress={handleInputFocus}>
                  <View pointerEvents="none">
                    <TextInput
                      ref={inputRef}
                      returnKeyType="search"
                      value={address}
                      selection={{ start: 0 }}
                    />
                  </View>
                </PressableStyled>
              </View>
              <MapZoneBottomSheetPanel selectedZone={selectedZone} />
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
})

export default MapZoneBottomSheet
