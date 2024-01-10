/* eslint-disable babel/camelcase */

import { FeatureCollection, GeoJsonProperties, MultiPolygon, Point, Polygon } from 'geojson'

import { MapPointIconEnum, MapPointKindEnum, MapZoneStatusEnum } from '@/modules/map/constants'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ArcgisAliased {
  export type UdrZone = {
    OBJECTID: number
    Shape: Polygon | MultiPolygon
    'Mestská časť': string
    'Kód rezidentskej zóny': string
    Názov: string
    'UDR ID': number
    'Cena (eur/h)': number
    'ODP Platnosť RPK a APK': string
    'Časové obmedzenie dĺžky parkovania (min)': number
    'Obmedzené len pre RPK, APK': string
    'Úvodný bezplatný čas parkovania (min)': number
    'Výnimka zo spoplatnenia (RPK, APK)': string
    'Vyhradené parkovacie státie (sk)': string
    'Vyhradené parkovacie státie (en)': string
    'Výnimka z obmedzenia dĺžky parkovania (RPK, APK)': string
    GlobalID: string
    GlobalID_A: string
    Status: MapZoneStatusEnum
    Obvod: number
    Plocha: number
    web: string
    'export partneri': string
    'Informácia RPK (sk)': string
    'Informácia RPK (en)': string
    'Informácia NPK (sk)': string
    'Informácia NPK (en)': string
    'Čas spoplatnenia (sk)': string
    'Čas spoplatnenia (en)': string
    'Doplnková informácia (sk)': string
    'Doplnková informácia (en)': string
    'Víkendy a sviatky': number
    layer: string // "visitors"
  }

  export type MapPoint = {
    icon: MapPointIconEnum
    kind: MapPointKindEnum
    OBJECTID: number // 4
  }

  export type BranchPoint = MapPoint & {
    SHAPE: Point
    Názov: string
    Miesto: string
    Adresa: string
    'Spresňujúce informácie (sk)': string
    'Spresňujúce informácie (en)': string
    'Otváracie hodiny (sk)': string
    'Otváracie hodiny (en)': string
    Navigácia: string
  }

  export type PartnerPoint = MapPoint & {
    SHAPE: Point
    'Predajné miesto': string
    Názov: string
    web: string
    Adresa: string
    'Otváracie hodiny (sk)': string
    'Otváracie hodiny (en)': string
    Navigácia: string
  }

  export type ParkomatPoint = MapPoint & {
    // Different alias than the others :) (why?)
    Shape: Point
    Lokalita: string
    'Rezidentská zóna': string
    UDR: number
    'Parkomat ID': string
    'Stav (sk)': string
    'Stav (en)': string
    'Dátum osadenia (sk)': string
    'Dátum osadenia (en)': string
    web: string
  }

  export type ParkingPoint = MapPoint & {
    SHAPE: Point
    'Názov (sk)': string
    'Názov (en)': string
    'Typ (sk)': string
    'Typ (en)': string
    'Počet parkovacích miest': string
    'Vzdialenosť k verejnej doprave': string
    'Verejná doprava': string
    'Dojazdová doba do centra': string
    web: string
    'Stav (sk)': string
    'Stav (en)': string
    'Povrch (sk)': string
    'Povrch (en)': string
    'Spádová oblasť': string
    'Prevádzkova doba': string
    'Informácia RPK (sk)': string
    'Informácia RPK (en)': string
    'Informácia NPK (sk)': string
    'Informácia NPK (en)': string
    Adresa: string
    Navigácia: string
    Partneri: string
  }

  export type PointTypes = {
    [MapPointKindEnum.branch]: BranchPoint
    [MapPointKindEnum.parkomat]: ParkomatPoint
    [MapPointKindEnum.partner]: PartnerPoint
    [MapPointKindEnum.pPlusR]: ParkingPoint
    [MapPointKindEnum.garage]: ParkingPoint
    [MapPointKindEnum.parkingLot]: ParkingPoint
  }

  // Type guard function using conditional types
  export function isPointOfKind<T extends MapPointKindEnum>(
    point: MapPoint,
    kind: T,
  ): point is PointTypes[T] {
    return point?.kind === kind
  }

  export interface RawData {
    rawParkomatsData?: FeatureCollection<Point, ParkomatPoint>
    rawPartnersData?: FeatureCollection<Point, PartnerPoint>
    rawParkingLotsData?: FeatureCollection<Point, ParkingPoint>
    rawBranchesData?: FeatureCollection<Point, BranchPoint>
    rawUdrData?: FeatureCollection<Polygon, UdrZone>
    rawOdpData?: FeatureCollection<Polygon, GeoJsonProperties>
    rawZonesData?: FeatureCollection<Polygon, GeoJsonProperties>
  }
}
