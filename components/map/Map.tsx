import {
  Camera,
  CameraPadding,
  FillLayer,
  LineLayer,
  MapView,
  ShapeSource,
  UserLocation,
  UserLocationRenderMode,
  UserTrackingMode,
} from '@rnmapbox/maps'
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
import { Keyboard, useWindowDimensions, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapMarkers from '@/components/map/MapMarkers'
import MapPin from '@/components/map/MapPin'
import MapZones from '@/components/map/MapZones'
import { CITY_BOUNDS, MAP_CENTER, MapFilters } from '@/modules/map/constants'
import { useCameraChangeHandler } from '@/modules/map/hooks/useCameraChangeHandler'
import { useFilteredMapData } from '@/modules/map/hooks/useFilteredMapData'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { getBottomMapPadding } from '@/modules/map/hooks/useMapCenter'
import { ProcessedMapData } from '@/modules/map/hooks/useProcessedArcgisData'
import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'
import { isWithinCityBounds } from '@/modules/map/utils/isWithinCityBounds'
import udrStyle from '@/modules/map/utils/layer-styles/visitors'

type Props = {
  onZoneChange?: (feature: MapUdrZone | null) => void
  onPointPress?: (point: MapInterestPoint) => void
  filters: MapFilters
  processedData: ProcessedMapData
  onMapPinVisibilityChange?: (isShown: boolean) => void
}

export type MapRef = {
  setFlyToCenter: (center: Position) => void
}

const ZOOM_ON_CLUSTER_PRESS = 1.5
const ZOOM_ON_PLACE_SELECT = 15

const Map = forwardRef(
  (
    { onZoneChange, onPointPress, filters, processedData, onMapPinVisibilityChange }: Props,
    ref: ForwardedRef<MapRef>,
  ) => {
    const camera = useRef<Camera>(null)
    const map = useRef<MapView>(null)
    const [followingUser, setFollowingUser] = useState(true)
    const [location] = useLocation()
    const insets = useSafeAreaInsets()
    const [selectedPolygon, setSelectedPolygon] = useState<Feature<Polygon, MapUdrZone> | null>(
      null,
    )
    const [isMapPinShown, setIsMapPinShown] = useState(false)
    const dimensions = useWindowDimensions()

    const [flyToCenter, setFlyToCenter] = useState<Position | undefined>()
    const [cameraZoom, setCameraZoom] = useState<number | undefined>()

    const selectedZone = useMemo(() => selectedPolygon?.properties, [selectedPolygon])

    const { markersData, udrData } = useFilteredMapData(processedData, filters)

    useEffect(() => {
      onZoneChange?.(selectedPolygon?.properties ?? null)
    }, [selectedPolygon, onZoneChange])

    useEffect(() => {
      onMapPinVisibilityChange?.(isMapPinShown)
    }, [onMapPinVisibilityChange, isMapPinShown])

    const handleSetFlyToCenter = useCallback((center: Position) => {
      setFollowingUser(false)
      setFlyToCenter(center)
      setCameraZoom(ZOOM_ON_PLACE_SELECT)
    }, [])

    useImperativeHandle(ref, () => ({ setFlyToCenter: handleSetFlyToCenter }), [
      handleSetFlyToCenter,
    ])

    const handleCameraChange = useCameraChangeHandler({
      isMapPinShown,
      map: map.current,
      selectedPolygon,
      setIsMapPinShown,
      setSelectedPolygon,
    })

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
      },
      [onPointPress],
    )

    const isWithinCity = useMemo(() => isWithinCityBounds(location), [location])

    const nonFollowingMapCenter = useMemo(() => flyToCenter ?? MAP_CENTER, [flyToCenter])

    const cameraPadding: CameraPadding = useMemo(() => {
      return {
        paddingBottom: getBottomMapPadding(dimensions.height),
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
      }
    }, [dimensions])

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
              maxBounds={CITY_BOUNDS}
              padding={cameraPadding}
            />
          ) : (
            <Camera
              ref={camera}
              followUserLocation={false}
              animationMode="flyTo"
              zoomLevel={cameraZoom ?? 11.5}
              centerCoordinate={nonFollowingMapCenter}
              maxBounds={CITY_BOUNDS}
              padding={cameraPadding}
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
          <ShapeSource
            id="highlight"
            // the shape cannot be null or undefined, but we must render the ShapeSource, because if it is rendered later the z-index breaks
            shape={selectedPolygon ?? { coordinates: [], type: 'Polygon' }}
          >
            <FillLayer
              id="highlight"
              style={udrStyle.find((layerStyle) => layerStyle.id === 'udr-fill-selected')?.paint}
            />
            <LineLayer
              id="higlight-lines"
              style={udrStyle.find((styleLayer) => styleLayer.id === 'udr-line-selected')?.paint}
            />
          </ShapeSource>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          {markersData && <MapMarkers markersData={markersData} onPointPress={handlePointPress} />}
        </MapView>
        {isMapPinShown && <MapPin price={selectedZone?.Zakladna_cena} />}
      </View>
    )
  },
)

export default Map
