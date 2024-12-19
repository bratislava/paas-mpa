import { Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps'
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent'
import { Feature, FeatureCollection, GeoJsonProperties, Point } from 'geojson'
import React, { useCallback, useMemo } from 'react'

import {
  ChristmasTreeImage,
  ClusterCircleImage,
  GarageImage,
  ParkingImage,
  ParkomatImage,
  PPLusRImage,
  SellingPointImage,
} from '@/assets/map/images'
import {
  CHRISTMAS_TREE_FEATURE,
  FeatureProperties,
  MapPointIconEnum,
} from '@/modules/map/constants'
import { markersStyles } from '@/modules/map/utils/layer-styles/markers'
import { isWinterHolidayPeriod } from '@/utils/isWinterHolidayPeriod'

type Props = {
  markersData: FeatureCollection<Point, FeatureProperties>
  onPointPress?: (point: Feature<Point, GeoJsonProperties>) => void
}

type MarkersDataType = [string, FeatureCollection<Point, FeatureProperties>]

const MapMarkers = ({ markersData, onPointPress }: Props) => {
  const markersDataByKind: MarkersDataType[] = useMemo(() => {
    return Object.values(MapPointIconEnum).map((icon) => [
      icon,
      {
        ...markersData,
        features: [
          ...markersData.features.filter((marker) => marker.properties?.icon === icon),
          ...(isWinterHolidayPeriod() ? [CHRISTMAS_TREE_FEATURE] : []),
        ],
      } satisfies FeatureCollection<Point, FeatureProperties>,
    ])
  }, [markersData])

  const handlePointPress = useCallback(
    (event: OnPressEvent) => {
      if (event?.features && event?.features.length > 0) {
        onPointPress?.(event.features[0] as Feature<Point, GeoJsonProperties>)
      }
    },
    [onPointPress],
  )

  return (
    <>
      <Images
        images={{
          [MapPointIconEnum.parkomat]: ParkomatImage,
          [MapPointIconEnum.garage]: GarageImage,
          [MapPointIconEnum.branch]: SellingPointImage,
          [MapPointIconEnum.partner]: SellingPointImage,
          [MapPointIconEnum.pPlusR]: PPLusRImage,
          [MapPointIconEnum.parkingLot]: ParkingImage,
          [MapPointIconEnum.christmasTree]: ChristmasTreeImage,
          clusterCircle: ClusterCircleImage,
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
            style={markersStyles.pin}
            filter={['!has', 'point_count']}
          />
          <SymbolLayer
            id={`${icon}MarkersCluster`}
            style={{ ...markersStyles.sellingPointCluster, iconImage: icon }}
            filter={['has', 'point_count']}
          />
          <SymbolLayer
            id={`${icon}MarkersClusterCount`}
            style={markersStyles.clusterCount}
            filter={['has', 'point_count']}
          />
        </ShapeSource>
      ))}
    </>
  )
}

export default MapMarkers
