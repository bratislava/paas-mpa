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
  const markersDataByKind = useMemo(
    () => ({
      parkomats: {
        ...markersData,
        features: markersData?.features.filter(
          (marker) => marker.properties?.icon === IconsEnum.parkomat,
        ),
      } as FeatureCollection,
      sellingPoints: {
        ...markersData,
        features: markersData?.features.filter(
          (marker) => marker.properties?.icon === IconsEnum.partner,
        ),
      } as FeatureCollection,
      others: {
        ...markersData,
        features: markersData?.features.filter(
          (marker) =>
            ![IconsEnum.parkomat, IconsEnum.partner].includes(marker.properties?.icon as IconsEnum),
        ),
      } as FeatureCollection,
    }),
    [markersData],
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
      {markersDataByKind.others?.features?.length > 0 && (
        <ShapeSource id="markersOthersSource" shape={markersDataByKind.others}>
          <SymbolLayer
            id="markersOthersSymbol"
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.pin}
          />
        </ShapeSource>
      )}
      {markersDataByKind?.sellingPoints?.features?.length > 0 && (
        <ShapeSource
          id="markersSellingPointsSource"
          shape={markersDataByKind.sellingPoints}
          clusterRadius={50}
          clusterMaxZoomLevel={14}
          cluster
        >
          <SymbolLayer
            id="markersSellingPointsSymbol"
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.pin}
          />
          <SymbolLayer
            id="markersSellingPointsCluster"
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.sellingPointCluster}
            filter={['has', 'point_count']}
          />
          <SymbolLayer
            id="markersSellingPointsClusterCount"
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.clusterCount}
            filter={['has', 'point_count']}
          />
        </ShapeSource>
      )}
      {markersDataByKind?.parkomats?.features?.length > 0 && (
        <ShapeSource
          id="markersParkomatsSource"
          shape={markersDataByKind.parkomats}
          clusterRadius={50}
          clusterMaxZoomLevel={14}
          cluster
        >
          <SymbolLayer
            id="markersParkomatsSymbol"
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.pin}
          />
          <SymbolLayer
            id="markersParkomatsCluster"
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.parkomatCluster}
            filter={['has', 'point_count']}
          />
          <SymbolLayer
            id="markersParkomatsClusterCount"
            // eslint-disable-next-line react-native/no-inline-styles
            style={markersStyles.clusterCount}
            filter={['has', 'point_count']}
          />
        </ShapeSource>
      )}
    </>
  )
}

export default MapMarkers
