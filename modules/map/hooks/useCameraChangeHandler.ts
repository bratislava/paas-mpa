import MapView, { MapState } from '@rnmapbox/maps/lib/typescript/components/MapView'
import { Feature, Polygon } from 'geojson'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { useMapCenter } from '@/modules/map/hooks/useMapCenter'
import { MapUdrZone } from '@/modules/map/types'
import { interpolate } from '@/utils/interpolate'

const HIDE_MARKER_ON_ZOOM_OVER = 13.5
const DEBOUNCE_TIME = 50
const QUERY_RECT_SIZE = 40

type Dependencies = {
  map: MapView | null
  isMapPinShown: boolean
  selectedPolygon: Feature<Polygon, MapUdrZone> | null
  setSelectedPolygon: Dispatch<SetStateAction<Feature<Polygon, MapUdrZone> | null>>
  setIsMapPinShown: Dispatch<SetStateAction<boolean>>
  onStateChange?: (state: MapState) => void
}

export const useCameraChangeHandler = ({
  map,
  isMapPinShown,
  selectedPolygon,
  setSelectedPolygon,
  setIsMapPinShown,
  onStateChange,
}: Dependencies) => {
  const screenCenter = useMapCenter({ scale: Platform.OS === 'android' })
  const [lastCenter, setLastCenter] = useState<number[]>([0, 0])
  const getCurrentPolygon = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (state: MapState) => {
      const rectHalfSize = interpolate(state.properties.zoom, [13.5, 15], [0, QUERY_RECT_SIZE / 2])
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
      if ((featuresAtCenter?.features?.length ?? 0) < 1) {
        setSelectedPolygon(null)
      } else if (isMapPinShown) {
        const feature = featuresAtCenter!.features[0] as Feature<Polygon, MapUdrZone>
        if (feature.properties.OBJECTID !== selectedPolygon?.properties.OBJECTID) {
          setSelectedPolygon(feature)
        }
      }
    },
    [screenCenter, isMapPinShown, selectedPolygon, map, setSelectedPolygon],
  )

  const debouncedHandleCameraChange = useDebouncedCallback((state: MapState) => {
    getCurrentPolygon(state)
  }, DEBOUNCE_TIME)

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
      if (!Keyboard.isVisible()) {
        debouncedHandleCameraChange(state)
        if (state.properties.zoom < HIDE_MARKER_ON_ZOOM_OVER) {
          setIsMapPinShown(false)
        } else {
          setIsMapPinShown(true)
        }
      }
    },
    [debouncedHandleCameraChange, setIsMapPinShown, lastCenter, onStateChange],
  )
}
