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
import { Feature, GeoJsonProperties, Point, Polygon, Position } from 'geojson'
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Keyboard, Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDebouncedCallback } from 'use-debounce'

import MapMarkers from '@/components/map/MapMarkers'
import MapPin from '@/components/map/MapPin'
import MapZones from '@/components/map/MapZones'
import { MAP_CENTER, MapFilters } from '@/modules/map/constants'
import { useFilteredMapData } from '@/modules/map/hooks/useFilteredMapData'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { useProcessedArcgisData } from '@/modules/map/hooks/useProcessedMapData'
import { useScreenCenter } from '@/modules/map/hooks/useScreenCenter'
import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'
import { isWithinCityBounds } from '@/modules/map/utils/isWithinCityBounds'
import udrStyle from '@/modules/map/utils/layer-styles/visitors'

type Props = {
  onZoneChange?: (feature: MapUdrZone | null) => void
  onPointPress?: (point: MapInterestPoint) => void
  filters: MapFilters
}

export type MapRef = {
  setFlyToCenter: (center: Position) => void
}

const DEBOUNCE_TIME = 50
const ZOOM_ON_CLUSTER_PRESS = 1.5
const HIDE_MARKER_ON_ZOOM_OVER = 13.5
const ZOOM_ON_PLACE_SELECT = 15

const Map = forwardRef(
  ({ onZoneChange, onPointPress, filters }: Props, ref: ForwardedRef<MapRef>) => {
    const camera = useRef<Camera>(null)
    const map = useRef<MapView>(null)
    const [followingUser, setFollowingUser] = useState(true)
    const [location] = useLocation()
    const insets = useSafeAreaInsets()
    const screenCenter = useScreenCenter({ scale: Platform.OS === 'android' })
    const [selectedPolygon, setSelectedPolygon] = useState<Feature<Polygon, MapUdrZone> | null>(
      null,
    )
    const [selectedPoint, setMapInterestPoint] = useState<Feature<Point, MapInterestPoint> | null>(
      null,
    )
    const [isMapPinShown, setIsMapPinShown] = useState(false)

    const [flyToCenter, setFlyToCenter] = useState<Position | undefined>()
    const [cameraZoom, setCameraZoom] = useState<number | undefined>()

    const selectedZone = useMemo(() => selectedPolygon?.properties, [selectedPolygon])

    const { isLoading, ...processedData } = useProcessedArcgisData()

    const { markersData, zonesData, udrData, odpData } = useFilteredMapData(processedData, filters)

    useEffect(() => {
      onZoneChange?.(selectedPolygon ? selectedPolygon?.properties : null)
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
        if (isMapPinShown) {
          const feature = featuresAtCenter!.features[0] as Feature<Polygon, MapUdrZone>
          if (feature.properties.OBJECTID !== selectedPolygon?.properties.OBJECTID) {
            setSelectedPolygon(feature)
          }
        }
      },
      [screenCenter, isMapPinShown, selectedPolygon],
    )

    const handleSetFlyToCenter = useCallback((center: Position) => {
      setFollowingUser(false)
      setFlyToCenter(center)
      setCameraZoom(ZOOM_ON_PLACE_SELECT)
    }, [])

    useImperativeHandle(ref, () => ({ setFlyToCenter: handleSetFlyToCenter }), [
      handleSetFlyToCenter,
    ])

    const debouncedHandleCameraChange = useDebouncedCallback((state: MapState) => {
      getCurrentPolygon(state)
    }, DEBOUNCE_TIME)

    const handleCameraChange = useCallback(
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
      [debouncedHandleCameraChange],
    )

    const handlePointPress = useCallback(
      async (point: Feature<Point, GeoJsonProperties>) => {
        if (point.properties?.point_count) {
          setFollowingUser(false)
          setFlyToCenter(point.geometry.coordinates)
          const zoom = await map.current?.getZoom()
          setCameraZoom(zoom ? zoom + ZOOM_ON_CLUSTER_PRESS : 14)

          return
        }
        onPointPress?.(point.properties as MapInterestPoint)
        setMapInterestPoint(point as Feature<Point, MapInterestPoint>)
      },
      [onPointPress],
    )

    const isWithinCity = useMemo(() => isWithinCityBounds(location), [location])

    const nonFollowingMapCenter = useMemo(() => flyToCenter ?? MAP_CENTER, [flyToCenter])

    return (
      <View className="flex-1">
        <MapView
          ref={map}
          className="grow"
          // eslint-disable-next-line no-secrets/no-secrets
          styleURL="mapbox://styles/inovaciebratislava/cl5teyncz000614o4le1p295o"
          onCameraChanged={handleCameraChange}
          onPress={Keyboard.dismiss}
          scaleBarEnabled={false}
          compassEnabled
          // 44 is the size of the menu icon, 10 margin
          compassPosition={{ top: insets.top + 44 + 10, right: 5 }}
          compassFadeWhenNorth
        >
          {location && isWithinCity ? (
            <Camera
              ref={camera}
              followUserLocation={followingUser}
              followUserMode={UserTrackingMode.Follow}
              animationMode="flyTo"
              followZoomLevel={14}
              zoomLevel={cameraZoom}
              centerCoordinate={flyToCenter}
            />
          ) : (
            <Camera
              ref={camera}
              followUserLocation={false}
              animationMode="flyTo"
              zoomLevel={cameraZoom ?? 11.5}
              centerCoordinate={nonFollowingMapCenter}
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
          {udrData && <MapZones udrData={udrData} />}
          {selectedPolygon && (
            <ShapeSource id="highlight" shape={selectedPolygon}>
              <FillLayer
                id="highlight"
                style={udrStyle.find((layerStyle) => layerStyle.id === 'udr-fill-selected')?.paint}
              />
            </ShapeSource>
          )}
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          {markersData && <MapMarkers markersData={markersData} onPointPress={handlePointPress} />}
        </MapView>
        {isMapPinShown && <MapPin price={selectedZone?.Zakladna_cena} />}
      </View>
    )
  },
)

export default Map
