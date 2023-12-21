import MapView, { MapState } from '@rnmapbox/maps/lib/typescript/components/MapView'
import { Position } from 'geojson'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Keyboard, Platform, useWindowDimensions } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { useMapCenter } from '@/modules/map/hooks/useMapCenter'
import { UdrZoneFeature } from '@/modules/map/types'
import { interpolate } from '@/utils/interpolate'

const HIDE_MARKER_ON_ZOOM_OVER = 13.5
const DEBOUNCE_TIME = 50
const RESET_FLY_TO_CENTER_TIME = 500
const QUERY_RECT_SIZE = 5

type Dependencies = {
  map: MapView | null
  isMapPinShown: boolean
  selectedPolygon: UdrZoneFeature | null
  setSelectedPolygon: Dispatch<SetStateAction<UdrZoneFeature | null>>
  setIsMapPinShown: Dispatch<SetStateAction<boolean>>
  onStateChange?: (state: MapState) => void
  setFlyToCenter: Dispatch<SetStateAction<Position | null>>
}

export const useCameraChangeHandler = ({
  map,
  isMapPinShown,
  selectedPolygon,
  setSelectedPolygon,
  setIsMapPinShown,
  onStateChange,
  setFlyToCenter,
}: Dependencies) => {
  const { scale } = useWindowDimensions()
  const screenCenter = useMapCenter({ scale: Platform.OS === 'android' })
  const [lastCenter, setLastCenter] = useState<number[]>([0, 0])
  const getCurrentPolygon = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (state: MapState) => {
      const rectSize = (QUERY_RECT_SIZE / 2) * (Platform.OS === 'android' ? scale : 1)
      const rectHalfSize = interpolate(state.properties.zoom, [13.5, 15], [0, rectSize])
      const featuresAtCenter = await map?.queryRenderedFeaturesInRect(
        [
          screenCenter.top + rectHalfSize,
          screenCenter.left + rectHalfSize,
          screenCenter.top - rectHalfSize,
          screenCenter.left - rectHalfSize,
        ],
        null,
        ['udrFill', 'udrFill2'],
      )
      if (!featuresAtCenter?.features?.length) {
        setSelectedPolygon(null)
      } else if (isMapPinShown) {
        const feature = featuresAtCenter.features[0] as UdrZoneFeature
        if (feature.properties.OBJECTID !== selectedPolygon?.properties.OBJECTID) {
          setSelectedPolygon(feature)
        }
      }
    },
    [screenCenter, isMapPinShown, selectedPolygon, map, setSelectedPolygon, scale],
  )

  const debouncedHandleCameraChange = useDebouncedCallback((state: MapState) => {
    getCurrentPolygon(state)
  }, DEBOUNCE_TIME)

  const resetFlyToCenterHandler = useDebouncedCallback(() => {
    setFlyToCenter(null)
  }, RESET_FLY_TO_CENTER_TIME)

  return useCallback(
    (state: MapState) => {
      if (
        lastCenter[0] === state.properties.center[0] &&
        lastCenter[1] === state.properties.center[1]
      ) {
        return
      }
      onStateChange?.(state)
      setLastCenter(state.properties.center)
      resetFlyToCenterHandler()
      if (!Keyboard.isVisible()) {
        debouncedHandleCameraChange(state)
        if (state.properties.zoom < HIDE_MARKER_ON_ZOOM_OVER) {
          setIsMapPinShown(false)
        } else {
          setIsMapPinShown(true)
        }
      }
    },
    [
      debouncedHandleCameraChange,
      setIsMapPinShown,
      lastCenter,
      onStateChange,
      resetFlyToCenterHandler,
    ],
  )
}
