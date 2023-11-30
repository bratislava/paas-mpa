import BottomSheet from '@gorhom/bottom-sheet'
import { PortalHost } from '@gorhom/portal'
import clsx from 'clsx'
import { Feature, Polygon } from 'geojson'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Keyboard, LayoutAnimation, Pressable, TextInput, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MapRef } from '@/components/map/Map'
import MapAutocomplete from '@/components/map/MapAutocomplete'
import MapZoneBottomSheetAttachment from '@/components/map/MapZoneBottomSheetAttachment'
import MapZoneBottomSheetPanel from '@/components/map/MapZoneBottomSheetPanel'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import Typography from '@/components/shared/Typography'
import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { useTranslation } from '@/hooks/useTranslation'
import {
  GeocodingFeature,
  isGeocodingFeature,
  MapUdrZone,
  NormalizedUdrZone,
} from '@/modules/map/types'
import { findMostCenterPointInPolygon } from '@/modules/map/utils/findPolygonCenter'

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

// TODO refactor to reduce complexity, separate some components, simplify logic
const MapZoneBottomSheet = forwardRef<BottomSheet, Props>((props, ref) => {
  const { zone: selectedZone, setFlyToCenter } = props

  const t = useTranslation()
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

  const handleInputFocus = useCallback(() => {
    setIsFullHeight(true)
  }, [])

  const handleCancel = useCallback(() => {
    localRef.current?.collapse()
  }, [])

  const handleChoice = useCallback(
    (newValue: GeocodingFeature | Feature<Polygon, MapUdrZone>) => {
      handleInputBlur()
      localRef.current?.collapse()
      if (isGeocodingFeature(newValue)) {
        setFlyToCenter?.(newValue.center)
      } else {
        setFlyToCenter?.(findMostCenterPointInPolygon(newValue.geometry.coordinates))
      }
    },
    [handleInputBlur, setFlyToCenter],
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
          <View className={clsx(isFullHeight && 'flex-1')}>
            <View>
              <FlexRow>
                <View className="flex-1">
                  <Pressable onPress={handleInputFocus}>
                    <View pointerEvents={isFullHeight ? 'auto' : 'none'}>
                      {!isFullHeight && (
                        <Typography variant="default-bold" className="pb-1">
                          {t('ZoneBottomSheet.title')}
                        </Typography>
                      )}
                      <MapAutocomplete
                        ref={inputRef}
                        optionsPortalName="mapAutocompleteOptions"
                        onValueChange={handleChoice}
                      />
                    </View>
                  </Pressable>
                </View>
                {isFullHeight && (
                  <Button variant="plain-dark" onPress={handleCancel} onPressIn={handleInputBlur}>
                    {t('Common.cancel')}
                  </Button>
                )}
              </FlexRow>
            </View>
            <View className="flex-1">
              {isFullHeight && (
                <Pressable onTouchStart={handleInputBlur}>
                  <View className="h-full pt-5">
                    <PortalHost name="mapAutocompleteOptions" />
                  </View>
                </Pressable>
              )}
            </View>
          </View>
          {!isFullHeight && <MapZoneBottomSheetPanel selectedZone={selectedZone} />}
        </BottomSheetContent>
      </BottomSheet>
    </>
  )
})

export default MapZoneBottomSheet
