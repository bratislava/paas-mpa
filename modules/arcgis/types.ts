/* eslint-disable babel/camelcase */

import {
  FeatureCollection,
  GeoJsonProperties,
  GeoJsonTypes,
  Geometry,
  Point,
  Polygon,
} from 'geojson'

import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { MapPointIconEnum, MapPointKindEnum, MapZoneStatusEnum } from '@/modules/map/constants'

export type GeocodingFeature = {
  id: string
  type: GeoJsonTypes
  place_type: (
    | 'country'
    | 'region'
    | 'postcode'
    | 'district'
    | 'place'
    | 'locality'
    | 'neighborhood'
    | 'address'
    | 'poi'
  )[]
  relevance: number // 0 -> 1
  address?: string // house number for place_type 'address'
  properties: {
    accuracy?: 'rooftop' | 'parcel' | 'point' | 'interpolated' | 'intersection' | 'street'
    address?: string // for place_type 'poi'
    category?: string
    maki?: string
    wikidata?: string
    short_code?: string
  }
  text: string
  place_name: string
  matching_text?: string
  matching_place_name?: string
  bbox: number[]
  center: [number, number]
  geometry: Geometry
  routable_points?: {
    points?: { coordinates: [number, number] }[] | null
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Arcgis {
  export type UdrZone = {
    OBJECTID: number
    Nazov: string
    Zakladna_cena: number // 2
    Cas_spoplatnenia_en: string // "8-24"
    Cas_spoplatnenia_sk: string // "8-24"
    Casove_obmedzenie_dlzky_park: number // 0
    Doplnkova_informacia_en: string // "Bonus parking card cannot be used in this segment"
    Doplnkova_informacia_sk: string // "V tomto úseku nie je možné využiť bonusovú parkovaciu kartu"
    GlobalID: string // Uuid
    Informacia_RPK_sk: string
    Informacia_RPK_en: string
    Informacia_NPK_sk: string
    Informacia_NPK_en: string
    Kod_rezidentskej_zony: string // "SM0"
    Status: MapZoneStatusEnum // "active"
    UDR_ID: number // 1027
    ODP_RPKAPK: string // "SM0"
    Obmedzene_len_pre_RPK_APK: string // "N/A"
    UTJ: string // "Staré Mesto"
    Uvodny_bezplatny_cas_parkovan: number // 0
    Vyhradene_park_statie_en: string // "public"
    Vyhradene_park_statie_sk: string // ""verejné""
    Vynimka_z_obmedzenia_dlzky_pa: string // "N/A"
    Vynimka_zo_spoplatnenia: string // "0-24"
    export_partneri: string // "ano"
    layer: string // "visitors"
    vikendy_a_sviatky: number // 1
    web: string // "ano"
  }

  export type MapPoint = {
    Navigacia: string // "https://www.google.com/maps/place/Magistr%C3%A1t+hlavn%C3%A9ho+mesta+SR+Bratislavy/@48.1439423,17.1091824,234m/data=!3m3!1e3!4b1!5s0x476c89431d7c7795:0x4caf7acfb0ed99d7!4m5!3m4!1s0x476c89433d1bc761:0x6ad8016ef317f8f0!8m2!3d48.1439414!4d17.1097296"
    icon: MapPointIconEnum
    kind: MapPointKindEnum
    OBJECTID: number // 4
  }

  export type BranchPoint = MapPoint & {
    Adresa: string // "Primaciálne nám. 1, 811 01 Bratislava"
    Miesto: string // "Magistrát hl. mesta SR Bratislavy"
    Nazov: string // "PAAS Centrum"
    Otvaracie_hodiny_en: string // "Mo 8:30-17:00, Tu-Th 8:30-16:00, Fr 8:30-15:00"
    Otvaracie_hodiny_sk: string // "Po 8:30-17:00, Ut-Št 8:30-16:00, Pi 8:30-15:00"
    Spresnujuce_informacie_en: string
    Spresnujuce_informacie_sk: string
  }

  export type PartnerPoint = MapPoint & {
    adresa: string // "Jesenského 4"
    Miesto: string // "Magistrát hl. mesta SR Bratislavy"
    Nazov: string // "Talks kaviareň "
    Otvaracie_hodiny_en: string // "Mo-Th 7:15-18:00 Fr 7:15-19:00 Sa 9:00-19:00 Su 10:00-18:00"
    Otvaracie_hodiny_sk: string // "Otvaracie_hodiny_sk": "Po-Št 7:15-18:00 Pi 7:15-19:00 So 9:00-19:00 Ne 10:00-18:00"
    Predajne_miesto: string // "Talks kaviareň"
    web?: string // "ano"
  }

  export type ParkomatPoint = MapPoint & {
    Datum_osadenia_en: string // '31.07.2023'
    Datum_osadenia_sk: string // '31.07.2023'
    Lokalita: string // 'Rigeleho x Paulínyho'
    Parkomat_ID: string // 'P0076'
    Rezidentska_zona: string // 'SM0'
    UDR: number // 1015
    Web: string // 'ano'
    Navigacia: never
  }

  export type ParkingPoint = MapPoint & {
    Nazov_sk: string // 'P+R Komisárky'
    Pocet_parkovacich_miest: string // '163'
    Verejna_doprava: string // '3'
    Vzdialenost: string // '\u003C250 m'
    Dojazdova_doba: string // '28 min'
    Stav_sk: string // 'nové'
    ORIG_FID: number // 0
    web?: string // 'ano'
    Povrch_sk: string // 'parkovisko'
    Povrch_en: string // 'parking lot'
    Spadova_oblast: string | null // null
    Prevadzkova_doba: string // 'Parkovanie povolené v pracovné dni od 05:00 do 24:00, cez víkendy a sviatky v čase 00:00-24:00. Parkovanie je bezplatné.'
    Informacia_RPK_sk: string | null // null
    Informacia_NPK_sk: string | null // null
    Typ_sk: string // 'P+R'
    Adresa: string | null // null
    Typ_en: string // 'P+R'
    Nazov_en: string // 'P+R Komisárky'
    Stav_en: string // 'new'
    Informacia_RPK_en: string | null // null
    Informacia_NPK_en: string | null // null
    Partneri: string | null // null
  }

  export type PointTypes = {
    [MapPointKindEnum.branch]: BranchPoint
    [MapPointKindEnum.parkomat]: ParkomatPoint
    [MapPointKindEnum.partner]: PartnerPoint
    [MapPointKindEnum.pPlusR]: ParkingPoint
    [MapPointKindEnum.garage]: ParkingPoint
    [MapPointKindEnum.parkingLot]: ParkingPoint
    [MapPointKindEnum.christmasTree]: MapPoint
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

export interface ArcgisData {
  rawParkomatsData: FeatureCollection<Point, Arcgis.ParkomatPoint | ArcgisAliased.ParkomatPoint>
  rawPartnersData: FeatureCollection<Point, Arcgis.PartnerPoint | ArcgisAliased.PartnerPoint>
  rawParkingLotsData: FeatureCollection<Point, Arcgis.ParkingPoint | ArcgisAliased.ParkingPoint>
  rawBranchesData: FeatureCollection<Point, Arcgis.BranchPoint | ArcgisAliased.BranchPoint>
  rawUdrData: FeatureCollection<Polygon, Arcgis.UdrZone | ArcgisAliased.UdrZone>
  rawOdpData: FeatureCollection<Polygon, GeoJsonProperties>
  rawZonesData: FeatureCollection<Polygon, GeoJsonProperties>
}
