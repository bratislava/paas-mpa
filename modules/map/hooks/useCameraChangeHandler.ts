import MapView, { MapState } from '@rnmapbox/maps/lib/typescript/components/MapView'
import { Feature, Polygon } from 'geojson'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { Keyboard, Platform } from 'react-native'
import { useDebouncedCallback } from 'use-debounce'

import { useScreenCenter } from '@/modules/map/hooks/useScreenCenter'
import { MapUdrZone } from '@/modules/map/types'

const HIDE_MARKER_ON_ZOOM_OVER = 13.5
const DEBOUNCE_TIME = 50

type Dependencies = {
  map: MapView | null
  isMapPinShown: boolean
  selectedPolygon: Feature<Polygon, MapUdrZone> | null
  setSelectedPolygon: Dispatch<SetStateAction<Feature<Polygon, MapUdrZone> | null>>
  setIsMapPinShown: Dispatch<SetStateAction<boolean>>
}

export const useCameraChangeHandler = ({
  map,
  isMapPinShown,
  selectedPolygon,
  setSelectedPolygon,
  setIsMapPinShown,
}: Dependencies) => {
  const screenCenter = useScreenCenter({ scale: Platform.OS === 'android' })
  const getCurrentPolygon = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (state: MapState) => {
      const featuresAtCenter = await map?.queryRenderedFeaturesAtPoint(
        [screenCenter.left, screenCenter.top],
        null,
        ['udrFill', 'udrFill2'],
      )
      if ((featuresAtCenter?.features?.length ?? 0) < 1) {
        setSelectedPolygon(null)

        return
      }
      if (isMapPinShown) {
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
      if (!Keyboard.isVisible()) {
        debouncedHandleCameraChange(state)
        if (state.properties.zoom < HIDE_MARKER_ON_ZOOM_OVER) {
          setIsMapPinShown(false)
        } else {
          setIsMapPinShown(true)
        }
      }
    },
    [debouncedHandleCameraChange, setIsMapPinShown],
  )
}
