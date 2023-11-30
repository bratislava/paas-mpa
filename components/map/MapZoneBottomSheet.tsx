import BottomSheet from '@gorhom/bottom-sheet'
import clsx from 'clsx'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, LayoutAnimation, TextInput } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MapRef } from '@/components/map/Map'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import MapZoneBottomSheetPanel from '@/components/map/MapZoneBottomSheetPanel'
import MapZoneBottomSheetSearch from '@/components/map/MapZoneBottomSheetSearch'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { NormalizedUdrZone } from '@/modules/map/types'

const SNAP_POINTS = {
  noZone: 216,
  zone: 306,
  searchExpanded: '100%',
}

type Props = {
  zone: NormalizedUdrZone | null
  setFlyToCenter?: MapRef['setFlyToCenter']
}

const checkIfFullyExtended = (index: number, snapPoints: (number | string)[]) =>
  snapPoints.at(-1) === '100%' && (snapPoints.length === 3 ? index === 2 : index === 1)

const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone: selectedZone, setFlyToCenter } = props

  const localRef = useRef<BottomSheet>(null)
  const inputRef = useRef<TextInput>(null)
  const refSetter = useMultipleRefsSetter(ref, localRef)

  const { top, bottom } = useSafeAreaInsets()
  const [isFullHeight, setIsFullHeight] = useState(false)

  const snapPoints = useMemo(
    () => [
      (selectedZone ? SNAP_POINTS.zone : SNAP_POINTS.noZone) + bottom,
      SNAP_POINTS.searchExpanded,
    ],
    [selectedZone, bottom],
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
      localRef.current?.snapToPosition(SNAP_POINTS.searchExpanded)
    }
  }, [isFullHeight])

  const animatedPosition = useSharedValue(0)

  return (
    <>
      {!isFullHeight && <MapZoneBottomSheetAttachment {...{ animatedPosition, setFlyToCenter }} />}
      <BottomSheet
        ref={refSetter}
        snapPoints={snapPoints}
        keyboardBehavior="interactive"
        onChange={handleChange}
        containerStyle={isFullHeight && { paddingTop: top }}
        // eslint-disable-next-line react-native/no-inline-styles
        handleIndicatorStyle={isFullHeight && { opacity: 0 }}
        handleComponent={BottomSheetHandleWithShadow}
        onAnimate={handleAnimate}
        animatedPosition={animatedPosition}
      >
        <BottomSheetContent cn={clsx('h-full bg-white', selectedZone ? 'g-2' : 'g-3')}>
          <MapZoneBottomSheetSearch
            {...{
              ref: inputRef,
              handleInputBlur,
              isFullHeight,
              setIsFullHeight,
              selectedZone,
              setFlyToCenter,
              bottomSheetRef: localRef.current,
            }}
          />
          {!isFullHeight && <MapZoneBottomSheetPanel selectedZone={selectedZone} />}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
})

export default MapZoneBottomSheet
