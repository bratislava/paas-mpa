/* eslint-disable babel/camelcase */

import { Feature, MultiPolygon, Polygon } from 'geojson'

import { GeocodingFeature } from '@/modules/arcgis/types'
import {
  MapLayerEnum,
  MapPointIconEnum,
  MapPointKindEnum,
  MapZoneStatusEnum,
} from '@/modules/map/constants'

export type MapUdrZone = {
  /** OBJECTID */
  id: number
  name: string
  price: number
  weekendsAndHolidaysPrice: number
  paidHours: string
  parkingDurationLimit: number
  additionalInformation: string
  rpkInformation: string
  npkInformation: string
  code: string
  status: MapZoneStatusEnum
  udrId: string
  udrUuid: string
  odpRpk: string
  restrictionOnlyRpk: string
  cityDistrict: string
  reservedParking: string
  initialFreeParkingDuration: number
  parkingDurationRestrictionException: string
  parkingFeeException: string
  layer: MapLayerEnum
}

export type MapPoint = {
  id: number
  name: string
  kind: MapPointKindEnum
  icon: MapPointIconEnum
  udrId?: string | null
  parkomatId?: string | null
  location?: string
  navigation?: string | null
  openingHours?: string | null
  address?: string | null
  addressDetail?: string
  place?: string
  parkingSpotCount?: number
  publicTransportLines?: string | null
  publicTransportTravelTime?: string | null
  distanceToPublicTransport?: string | null
  npkInformation?: string | null
  rpkInformation?: string | null
  surface?: string | null
}

export const isGeocodingFeature = (
  value: GeocodingFeature | UdrZoneFeature,
): value is GeocodingFeature => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  return (value as any)?.place_name !== undefined
}

export type UdrZoneFeature = Feature<Polygon | MultiPolygon, MapUdrZoneWithTranslationProps>

export type ApplicationLocale = 'sk' | 'en'

export type TranslationProperty<T> = {
  [key in ApplicationLocale]: T
}

/**
 * @param K Keys of properties that have a translation translated
 */
export type WithTranslationProperties<P, K extends keyof P> = {
  [Property in keyof P as Property extends K ? Property : never]:
    | P[Property]
    | TranslationProperty<P[Property]>
} & {
  [Property in keyof P as Property extends K ? never : Property]: P[Property]
}

export type MapPointWithTranslationProps = WithTranslationProperties<
  MapPoint,
  'addressDetail' | 'openingHours' | 'name' | 'rpkInformation' | 'npkInformation' | 'surface'
>

export type MapUdrZoneWithTranslationProps = WithTranslationProperties<
  MapUdrZone,
  'paidHours' | 'additionalInformation' | 'rpkInformation' | 'npkInformation' | 'reservedParking'
>
