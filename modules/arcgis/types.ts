import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import {
  BranchPoint,
  MapUdrZone,
  ParkingPoint,
  ParkomatPoint,
  PartnerPoint,
} from '@/modules/map/types'

export interface ArcgisData {
  rawParkomatsData?: FeatureCollection<Point, ParkomatPoint>
  rawPartnersData?: FeatureCollection<Point, PartnerPoint>
  rawParkingLotsData?: FeatureCollection<Point, ParkingPoint>
  rawBranchesData?: FeatureCollection<Point, BranchPoint>
  rawUdrData?: FeatureCollection<Polygon, MapUdrZone>
  rawOdpData?: FeatureCollection<Polygon, GeoJsonProperties>
  rawZonesData?: FeatureCollection<Polygon, GeoJsonProperties>
}
