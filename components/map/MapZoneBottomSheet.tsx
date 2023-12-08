import BottomSheet from '@gorhom/bottom-sheet'
import clsx from 'clsx'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, LayoutAnimation, TextInput, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MapRef } from '@/components/map/Map'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import MapZoneBottomSheetPanel from '@/components/map/MapZoneBottomSheetPanel'
import MapZoneBottomSheetSearch from '@/components/map/MapZoneBottomSheetSearch'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Typography from '@/components/shared/Typography'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import { NormalizedUdrZone } from '@/modules/map/types'

const SNAP_POINTS = {
  noZone: 216,
  zone: 306,
  searchExpanded: '100%',
}

type Props = {
  zone: NormalizedUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
  isZoomedOut?: boolean
}

const checkIfFullyExtended = (index: number, snapPoints: (number | string)[]) =>
  snapPoints.at(-1) === '100%' && (snapPoints.length === 3 ? index === 2 : index === 1)

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone: selectedZone, setFlyToCenter, isZoomedOut } = props

  const localRef = useRef<BottomSheet>(null)
  const inputRef = useRef<TextInput>(null)
  const refSetter = useMultipleRefsSetter(ref, localRef)

  const t = useTranslation('ZoneBottomSheet')
  const { top, bottom } = useSafeAreaInsets()
  const [isFullHeight, setIsFullHeight] = useState(false)

  const snapPoints = useMemo(
    () =>
      isZoomedOut
        ? []
        : [
            (selectedZone ? SNAP_POINTS.zone : SNAP_POINTS.noZone) + bottom,
            SNAP_POINTS.searchExpanded,
          ],
    [selectedZone, bottom, isZoomedOut],
  )

  const handleInputBlur = useCallback(() => {
    if (inputRef.current?.isFocused()) {
      inputRef.current?.blur()
    } else {
      Keyboard.dismiss()
    }
  }, [])

  const handleChange = useCallback(
    (newIndex: number) => {
      const animation = LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
      LayoutAnimation.configureNext(animation)
      if (checkIfFullyExtended(newIndex, snapPoints)) {
        setIsFullHeight(true)
        inputRef.current?.focus()
      } else {
        handleInputBlur()
        setIsFullHeight(false)
      }
    },
    [snapPoints, handleInputBlur],
  )

  const handleAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (checkIfFullyExtended(toIndex, snapPoints)) {
        setIsFullHeight(true)
      }
    },
    [snapPoints],
  )

  useEffect(() => {
    localRef.current?.collapse()
  }, [selectedZone])

  useEffect(() => {
    if (isFullHeight) {
      localRef.current?.expand()
    }
  }, [isFullHeight])

  const animatedPosition = useSharedValue(0)
  const searchProps = {
    handleInputBlur,
    isFullHeight,
    setIsFullHeight,
    selectedZone,
    setFlyToCenter,
  }

  return (
    <>
      {!isFullHeight && <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />}
      <BottomSheet
        ref={refSetter}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        onChange={handleChange}
        containerStyle={isFullHeight && { paddingTop: top }}
        handleIndicatorStyle={isFullHeight && { opacity: 0 }}
        handleComponent={BottomSheetHandleWithShadow}
        onAnimate={handleAnimate}
        animatedPosition={animatedPosition}
        enableDynamicSizing={isZoomedOut}
      >
        <BottomSheetContent
          cn={clsx('bg-white', !isZoomedOut && 'h-full', selectedZone ? 'g-2' : 'g-3')}
        >
          {isZoomedOut ? (
            <View className="flex-col items-center">
              <Typography className="text-center">{t('zoomIn')}</Typography>
            </View>
          ) : (
            <>
              <MapZoneBottomSheetSearch
                {...searchProps}
                ref={inputRef}
                bottomSheetRef={localRef.current}
              />
              {!isFullHeight && <MapZoneBottomSheetPanel selectedZone={selectedZone} />}
            </>
          )}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
})

export default MapZoneBottomSheet
