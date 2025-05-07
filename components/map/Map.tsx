import { Camera, FillLayer, LineLayer, MapView, ShapeSource, UserLocation } from '@rnmapbox/maps'
import { Feature, GeoJsonProperties, Point, Position } from 'geojson'
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
import { View } from 'react-native'

import MapCamera from '@/components/map/MapCamera'
import MapMarkers from '@/components/map/MapMarkers'
import MapPin from '@/components/map/MapPin'
import MapZones from '@/components/map/MapZones'
import { MapFilters } from '@/modules/map/constants'
import { useCameraChangeHandler } from '@/modules/map/hooks/useCameraChangeHandler'
import { useFilteredMapData } from '@/modules/map/hooks/useFilteredMapData'
import { ProcessedMapData } from '@/modules/map/hooks/useProcessedArcgisData'
import {
  MapPointWithTranslationProps,
  MapUdrZoneWithTranslationProps,
  UdrZoneFeature,
} from '@/modules/map/types'
import { udrStyles } from '@/modules/map/utils/layer-styles/visitors'
import { useMapStoreUpdateContext } from '@/state/MapStoreProvider/useMapStoreUpdateContext'
import { getPriceFromZone } from '@/utils/getPriceFromZone'

type Props = {
  onZoneChange?: (feature: MapUdrZoneWithTranslationProps | null) => void
  onPointPress?: (point: MapPointWithTranslationProps) => void
  filters: MapFilters
  processedData: ProcessedMapData
  onMapPinVisibilityChange?: (isShown: boolean) => void
  onCenterChange?: (center: Position) => void
}

export type MapRef = {
  setFlyToCenter: (center: Position) => void
}

const ZOOM_ON_CLUSTER_PRESS = 1.5
const ZOOM_ON_PLACE_SELECT = 15

const Map = forwardRef(
  (
    {
      onZoneChange,
      onPointPress,
      filters,
      processedData,
      onMapPinVisibilityChange,

      onCenterChange,
    }: Props,
    ref: ForwardedRef<MapRef>,
  ) => {
    const camera = useRef<Camera>(null)
    const map = useRef<MapView>(null)
    const updateMapStoreContext = useMapStoreUpdateContext()
    const [selectedPolygon, setSelectedPolygon] = useState<UdrZoneFeature | null>(null)
    const [isMapPinShown, setIsMapPinShown] = useState(false)

    const [flyToCenter, setFlyToCenter] = useState<Position | null>(null)
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
      setFlyToCenter(center)
      setCameraZoom(ZOOM_ON_PLACE_SELECT)
    }, [])

    useEffect(() => {
      updateMapStoreContext({
        setFlyToCenter: handleSetFlyToCenter,
      })
    }, [updateMapStoreContext, handleSetFlyToCenter])

    useImperativeHandle(ref, () => ({ setFlyToCenter: handleSetFlyToCenter }), [
      handleSetFlyToCenter,
    ])

    const handleCameraChange = useCameraChangeHandler({
      map: map.current,
      isMapPinShown,
      selectedPolygon,
      setSelectedPolygon,
      setIsMapPinShown,
      setFlyToCenter,
      onCenterChange,
    })

    const handlePointPress = useCallback(
      async (point: Feature<Point, GeoJsonProperties>) => {
        if (point.properties?.point_count) {
          setFlyToCenter(point.geometry.coordinates)
          const zoom = await map.current?.getZoom()
          setCameraZoom(zoom ? zoom + ZOOM_ON_CLUSTER_PRESS : 14)

          return
        }
        onPointPress?.(point.properties as MapPointWithTranslationProps)
      },
      [onPointPress],
    )

    return (
      <View className="flex-1">
        <MapView
          ref={map}
          style={{ flex: 1 }}
          // eslint-disable-next-line no-secrets/no-secrets
          styleURL="mapbox://styles/inovaciebratislava/cl5teyncz000614o4le1p295o"
          onCameraChanged={handleCameraChange}
          scaleBarEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <MapCamera
            ref={camera}
            flyToCenter={flyToCenter}
            cameraZoom={cameraZoom}
            setFlyToCenter={setFlyToCenter}
          />

          {udrData && <MapZones udrData={udrData} />}

          <ShapeSource
            id="highlight"
            // the shape cannot be null or undefined, but we must render the ShapeSource, because if it is rendered later the z-index breaks
            shape={selectedPolygon ?? { coordinates: [], type: 'Polygon' }}
          >
            <FillLayer id="highlight" style={udrStyles.zoneFillSelected} />
            <LineLayer id="higlight-lines" style={udrStyles.lineSelected} />
          </ShapeSource>

          {markersData && <MapMarkers markersData={markersData} onPointPress={handlePointPress} />}

          <UserLocation
            androidRenderMode="gps"
            // TODO: fix indicator size bug
            // showsUserHeadingIndicator
            visible
            minDisplacement={3}
            animated
          />
        </MapView>
        {isMapPinShown && (
          <MapPin price={selectedZone ? getPriceFromZone(selectedZone) : undefined} />
        )}
      </View>
    )
  },
)

export default Map
