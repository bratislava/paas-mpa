import { Feature, Point, Polygon } from 'geojson'

import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'

export type MapFeaturesHashMapValue =
  | Feature<Polygon, MapUdrZone>
  | Feature<Point, MapInterestPoint>

export const isFeatureZone = (
  feature: MapFeaturesHashMapValue | null,
): feature is Feature<Polygon, MapUdrZone> => feature?.geometry.type === 'Polygon' ?? false