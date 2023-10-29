import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import {
  AssistantPoint,
  BranchPoint,
  MapUdrZone,
  ParkingLotPoint,
  ParkomatPoint,
  PartnerPoint,
} from '@/modules/map/types'

export interface ArcgisData {
  rawAssistantsData?: FeatureCollection<Point, AssistantPoint>
  rawParkomatsData?: FeatureCollection<Point, ParkomatPoint>
  rawPartnersData?: FeatureCollection<Point, PartnerPoint>
  rawParkingLotsData?: FeatureCollection<Point, ParkingLotPoint>
  rawBranchesData?: FeatureCollection<Point, BranchPoint>
  rawUdrData?: FeatureCollection<Polygon, MapUdrZone>
  rawOdpData?: FeatureCollection<Polygon, GeoJsonProperties>
  rawZonesData?: FeatureCollection<Polygon, GeoJsonProperties>
}
