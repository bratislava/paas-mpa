/* eslint-disable @typescript-eslint/no-unused-vars, unicorn/no-array-reduce */
import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
  UserLocation,
  UserLocationRenderMode,
  UserTrackingMode,
} from '@rnmapbox/maps'
import { MapState } from '@rnmapbox/maps/lib/typescript/components/MapView'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDebouncedCallback } from 'use-debounce'

import MapMarkers from '@/components/map/MapMarkers'
import MapPin from '@/components/map/MapPin'
import { CITY_BOUNDS, MAP_CENTER, MAP_INSETS } from '@/modules/map/constants'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { useProcessedArcgisData } from '@/modules/map/hooks/useProcessedMapData'
import { useScreenCenter } from '@/modules/map/hooks/useScreenCenter'
import { SelectedUdrZone } from '@/modules/map/types'
import { colors } from '@/modules/map/utils/layer-styles/colors'
import udrStyle from '@/modules/map/utils/layer-styles/visitors'

import MapZones from './MapZones'

type Props = {
  onZoneChange?: (feature: SelectedUdrZone) => void
}

const DEBOUNCE_TIME = 50

const Map = ({ onZoneChange }: Props) => {
  const camera = useRef<Camera>(null)
  const map = useRef<MapView>(null)
  const [followingUser, setFollowingUser] = useState(true)
  const [location] = useLocation()
  const insets = useSafeAreaInsets()
  const screenCenter = useScreenCenter({ scale: Platform.OS === 'android' })
  const [selectedPolygon, setSelectedPolygon] = useState<Feature<
    Geometry,
    GeoJsonProperties
  > | null>(null)

  const selectedZone = useMemo(() => selectedPolygon?.properties, [selectedPolygon])

  const { isLoading, markersData, zonesData, udrData, odpData } = useProcessedArcgisData()

  useEffect(() => {
    onZoneChange?.((selectedPolygon?.properties as SelectedUdrZone) ?? null)
  }, [selectedPolygon, onZoneChange])

  const getCurrentPolygon = useCallback(
    async (state: MapState) => {
      const featuresAtCenter = await map.current?.queryRenderedFeaturesAtPoint(
        [screenCenter.left, screenCenter.top],
        null,
        ['udrFill', 'udrFill2'],
      )
      if ((featuresAtCenter?.features?.length ?? 0) < 1) {
        setSelectedPolygon(null)

        return
      }
      const feature = featuresAtCenter!.features[0]
      setSelectedPolygon(feature)
    },
    [screenCenter],
  )

  const debouncedHandleCameraChange = useDebouncedCallback((state: MapState) => {
    getCurrentPolygon(state)
  }, DEBOUNCE_TIME)

  const handleCameraChange = useCallback(
    (state: MapState) => {
      debouncedHandleCameraChange(state)
    },
    [debouncedHandleCameraChange],
  )

  const isWithinCity = useMemo(() => {
    if (!location) return false
    const position = [location.coords.longitude, location.coords.latitude]
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (
      position[0] > CITY_BOUNDS.sw[0] &&
      position[1] > CITY_BOUNDS.sw[1] &&
      position[0] < CITY_BOUNDS.ne[0] &&
      position[1] < CITY_BOUNDS.ne[1]
    )
      return true

    return false
  }, [location])

  return (
    <View className="flex-1">
      <MapView
        ref={map}
        className="flex-1"
        // eslint-disable-next-line no-secrets/no-secrets
        styleURL="mapbox://styles/inovaciebratislava/cl5teyncz000614o4le1p295o"
        scaleBarPosition={{
          top: insets.top + MAP_INSETS.top,
          left: insets.left + MAP_INSETS.left,
        }}
        onCameraChanged={handleCameraChange}
      >
        {location && isWithinCity ? (
          <Camera
            ref={camera}
            followUserLocation={followingUser}
            followUserMode={UserTrackingMode.Follow}
            animationMode="flyTo"
            followZoomLevel={14}
          />
        ) : (
          <Camera
            ref={camera}
            followUserLocation={false}
            animationMode="flyTo"
            zoomLevel={11.5}
            centerCoordinate={MAP_CENTER}
          />
        )}
        <UserLocation
          androidRenderMode="gps"
          renderMode={UserLocationRenderMode.Normal}
          showsUserHeadingIndicator
          visible
          minDisplacement={3}
          animated
        />
        {/* {zonesData && (
          <ShapeSource id="zonesSource" shape={zonesData}>
            <FillLayer
              id="zonesSource"
              style={zonesStyle.reduce((prev, current) => ({ ...prev, ...current.paint }), {})}
            />
          </ShapeSource>
        )} */}
        {udrData && <MapZones udrData={udrData} />}
        {selectedPolygon && (
          <ShapeSource id="highlight" shape={selectedPolygon}>
            <FillLayer
              id="highlight"
              style={udrStyle.reduce((prev, current) => {
                const paint = { ...current.paint }
                if (paint.fillColor) {
                  paint.fillColor = [...paint.fillColor]
                  paint.fillColor[3] = colors.orange
                }

                return { ...prev, ...paint }
              }, {})}
            />
          </ShapeSource>
        )}
        {markersData && <MapMarkers markersData={markersData} />}
      </MapView>
      <MapPin price={selectedZone?.Zakladna_cena} />
    </View>
  )
}

export default Map
