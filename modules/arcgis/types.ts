import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import {
  BranchPoint,
  ParkingPoint,
  ParkomatPoint,
  PartnerPoint,
  UnparsedUdrZone,
} from '@/modules/map/types'

export interface ArcgisData {
  rawParkomatsData?: FeatureCollection<Point, ParkomatPoint>
  rawPartnersData?: FeatureCollection<Point, PartnerPoint>
  rawParkingLotsData?: FeatureCollection<Point, ParkingPoint>
  rawBranchesData?: FeatureCollection<Point, BranchPoint>
  rawUdrData?: FeatureCollection<Polygon, UnparsedUdrZone>
  rawOdpData?: FeatureCollection<Polygon, GeoJsonProperties>
  rawZonesData?: FeatureCollection<Polygon, GeoJsonProperties>
}
