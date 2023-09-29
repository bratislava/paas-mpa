import { Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/types/OnPressEvent'
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'
import { useCallback, useMemo } from 'react'

import {
  AssistantImage,
  GarageImage,
  ParkingImage,
  ParkomatImage,
  PPLusRImage,
  SellingPointImage,
} from '@/assets/map/images'
import { IconsEnum } from '@/modules/map/constants'
import markersStyles from '@/modules/map/utils/layer-styles/markers'

type Props = {
  markersData: FeatureCollection<Point, GeoJsonProperties | { icon: string }>
  onPointPress?: (point: Feature<Point, GeoJsonProperties>) => void
}

const MapMarkers = ({ markersData, onPointPress }: Props) => {
  const markersDataByKind: [
    string,
    FeatureCollection<Point, GeoJsonProperties | { icon: string }>,
  ][] = useMemo(() => {
    return Object.values(IconsEnum).map((icon) => [
      icon,
      {
        ...markersData,
        features: markersData?.features.filter((marker) => marker.properties?.icon === icon),
      } satisfies FeatureCollection<Point, GeoJsonProperties | { icon: string }>,
    ])
  }, [markersData])

  const handlePointPress = useCallback(
    (event: OnPressEvent) => {
      if (!event?.features || event.features.length === 0) return
      onPointPress?.(event.features[0] as Feature<Point, GeoJsonProperties>)
    },
    [onPointPress],
  )

  return (
    <>
      <Images
        images={{
          [IconsEnum.parkomat]: ParkomatImage,
          [IconsEnum.garage]: GarageImage,
          [IconsEnum.branch]: SellingPointImage,
          [IconsEnum.partner]: SellingPointImage,
          [IconsEnum.pPlusR]: PPLusRImage,
          [IconsEnum.parkingLot]: ParkingImage,
          [IconsEnum.assistant]: AssistantImage,
        }}
      />
      {markersDataByKind?.map(([icon, shape]) => (
        <ShapeSource
          id={`${icon}MarkersSource`}
          shape={shape}
          clusterRadius={50}
          clusterMaxZoomLevel={14}
          cluster
          onPress={handlePointPress}
          key={icon}
        >
          <SymbolLayer
            id={`${icon}MarkersSymbol`}
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.pin}
          />
          <SymbolLayer
            id={`${icon}MarkersCluster`}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ ...markersStyles.sellingPointCluster, iconImage: icon }}
            filter={['has', 'point_count']}
          />
          <SymbolLayer
            id={`${icon}MarkersClusterCount`}
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.clusterCount}
            filter={['has', 'point_count']}
          />
        </ShapeSource>
      ))}
    </>
  )
}

export default MapMarkers
