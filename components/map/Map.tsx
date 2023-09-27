/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
  UserLocation,
  UserLocationRenderMode,
  UserTrackingMode,
} from '@rnmapbox/maps'
import { MapState, RegionPayload } from '@rnmapbox/maps/lib/typescript/components/MapView'
import { PermissionStatus } from 'expo-location'
import { Feature, GeoJsonProperties, Geometry, Point } from 'geojson'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDebouncedCallback } from 'use-debounce'
import udrStyle from 'utils/layer-styles/visitors2'

import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { useProcessedArcgisData } from '@/modules/map/hooks/useProcessedMapData'
import { useScreenCenter } from '@/modules/map/hooks/useScreenCenter'
import { colors } from '@/utils/layer-styles/colors'

import { MAP_INSETS } from '../../modules/map/constants'
import MapPin from './MapPin'

type Props = {
  onBottomSheetContentChange?: (content: any) => void
}

const Map = ({ onBottomSheetContentChange }: Props) => {
  const camera = useRef<Camera>(null)
  const map = useRef<MapView>(null)
  const [followingUser, setFollowingUser] = useState(true)
  const { permissionStatus } = useLocationPermission()
  const insets = useSafeAreaInsets()
  const screenCenter = useScreenCenter({ scale: true })
  const [selectedPolygon, setSelectedPolygon] = useState<Feature<
    Geometry,
    GeoJsonProperties
  > | null>(null)

  const selectedZone = useMemo(() => selectedPolygon?.properties, [selectedPolygon])

  const { isLoading, markersData, zonesData, udrData, odpData } = useProcessedArcgisData()

  useEffect(() => {
    onBottomSheetContentChange?.(
      selectedPolygon
        ? `${selectedPolygon?.properties?.Nazov} [polygonId: ${selectedPolygon?.id}]`
        : null,
    )
  }, [selectedPolygon, onBottomSheetContentChange])

  const handleDebouncedCameraChange = useDebouncedCallback(async (state: MapState) => {
    const featuresAtCenter = await map.current?.queryRenderedFeaturesAtPoint(
      [screenCenter.left, screenCenter.top],
      null,
      ['udrFill'],
    )
    if ((featuresAtCenter?.features?.length ?? 0) < 1) {
      setSelectedPolygon(null)

      return
    }
    const feature = featuresAtCenter!.features[0]
    console.log(`Nazov: ${feature?.properties?.Nazov}`)
    setSelectedPolygon(feature)
  }, 200)

  const handleCameraChange = useCallback(
    (state: MapState) => {
      handleDebouncedCameraChange(state)
    },
    [handleDebouncedCameraChange],
  )

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
        {permissionStatus === PermissionStatus.GRANTED ? (
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
            animationMode="flyTo"
            zoomLevel={11.5}
            // eslint-disable-next-line unicorn/numeric-separators-style
            centerCoordinate={[17.1110118, 48.1512015]}
          />
        )}
        {permissionStatus === PermissionStatus.GRANTED && (
          <UserLocation
            androidRenderMode="gps"
            renderMode={UserLocationRenderMode.Normal}
            showsUserHeadingIndicator
            visible
            minDisplacement={3}
            animated
          />
        )}
        {udrData && (
          <ShapeSource id="udrSource" shape={udrData}>
            <FillLayer
              id="udrFill"
              style={udrStyle.reduce((prev, current) => ({ ...prev, ...current.paint }), {})}
            />
          </ShapeSource>
        )}
        {selectedPolygon && (
          <ShapeSource id="highlight" shape={selectedPolygon}>
            <FillLayer
              id="highlight"
              style={udrStyle.reduce((prev, current) => {
                const paint = { ...current.paint }
                if (paint.fillColor) {
                  paint.fillColor = [...paint.fillColor]
                  paint.fillColor[3] = colors.green
                }

                return { ...prev, ...paint }
              }, {})}
            />
          </ShapeSource>
        )}
      </MapView>
      <MapPin price={selectedZone?.Zakladna_cena} />
    </View>
  )
}

export default Map
