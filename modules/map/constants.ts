/* eslint-disable pii/no-phone-number, unicorn/numeric-separators-style */
import { Feature, GeoJsonProperties, Point } from 'geojson'

export const MAP_INSETS = {
  top: 40,
  right: 0,
  bottom: 0,
  left: 10,
}

export type FeatureProperties = GeoJsonProperties | { icon: string }

export enum MapLayerEnum {
  zones = 'zones',
  visitors = 'visitors',
  residents = 'residents',
}

export enum MapPointIconEnum {
  branch = 'branch',
  parkomat = 'parkomat',
  partner = 'partner',
  pPlusR = 'p-plus-r',
  garage = 'garage',
  parkingLot = 'parking-lot',
  christmasTree = 'christmas-tree',
}

export enum MapPointKindEnum {
  branch = 'branches',
  parkomat = 'parkomats',
  partner = 'partners',
  pPlusR = 'p-plus-r',
  garage = 'garages',
  parkingLot = 'parking-lots',
  christmasTree = 'christmas-tree',
}

export const CHRISTMAS_TREE_FEATURE: Feature<Point, FeatureProperties> = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [17.108_552, 48.143_717],
  },
  properties: {
    address: 'Hlavné námestie',
    icon: MapPointIconEnum.christmasTree,
    id: 0,
    kind: MapPointKindEnum.christmasTree,
  },
}

export enum MapZoneStatusEnum {
  active = 'active',
  inactive = 'inactive',
  planned = 'planned',
}

export const MAP_CENTER = [17.1110118, 48.1512015] // Bratislava
export const CITY_BOUNDS = {
  sw: [16.95716298676959, 48.02126829091361], // south-west corner
  ne: [17.28590508163896, 48.26473441916502], // north-east corner
}

// here because of a cyclic dependency
export type MapFilters = {
  [key in MapPointIconEnum]: 'true' | 'false'
} & {
  [key in MapZoneStatusEnum]: 'true' | 'false'
}

export const DEFAULT_FILTERS: MapFilters = {
  'p-plus-r': 'false',
  'parking-lot': 'false',
  branch: 'false',
  garage: 'false',
  parkomat: 'false',
  partner: 'false',
  active: 'true',
  inactive: 'false',
  planned: 'true',
  'christmas-tree': 'false',
}
