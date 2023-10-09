/* eslint-disable pii/no-phone-number, unicorn/numeric-separators-style */
export const MAP_INSETS = {
  top: 40,
  right: 0,
  bottom: 0,
  left: 10,
}

export enum MapLayerEnum {
  zones = 'zones',
  visitors = 'visitors',
  residents = 'residents',
}

export enum MapPointIconEnum {
  assistant = 'assistant',
  branch = 'branch',
  parkomat = 'parkomat',
  partner = 'partner',
  pPlusR = 'p-plus-r',
  garage = 'garage',
  parkingLot = 'parking-lot',
}

export enum MapPointKindEnum {
  assistant = 'assistants',
  branch = 'branches',
  parkomat = 'parkomats',
  partner = 'partners',
  pPlusR = 'p-plus-r',
  garage = 'garages',
  parkingLot = 'parking-lots',
}

export enum MapPointFilterKindEnum {
  assistant = 'assistant',
  parkomat = 'parkomat',
  sellingPoint = 'sellingPoint',
  pPlusR = 'p-plus-r',
  garage = 'garage',
  parkingLot = 'parking-lot',
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
  'p-plus-r': 'true',
  'parking-lot': 'true',
  assistant: 'true',
  garage: 'true',
  parkomat: 'true',
  sellingPoint: 'true',
  active: 'true',
  inactive: 'true',
  planned: 'true',
}
