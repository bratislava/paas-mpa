import { Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson'
import { useMemo } from 'react'

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
}

const MapMarkers = ({ markersData }: Props) => {
  const markersDataByKind: [
    string,
    FeatureCollection<Point, GeoJsonProperties | { icon: string }>,
  ][] = useMemo(() => {
    Object.keys(IconsEnum)

    return Object.keys(IconsEnum).map((icon) => [
      icon,
      {
        ...markersData,
        features: markersData?.features.filter((marker) => marker.properties?.icon === icon),
      } as FeatureCollection<Point, GeoJsonProperties | { icon: string }>,
    ])
  }, [markersData])

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
