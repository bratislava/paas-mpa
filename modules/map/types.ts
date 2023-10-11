/* eslint-disable babel/camelcase */

import { GeoJsonTypes, Geometry } from 'geojson'

import {
  MapLayerEnum,
  MapPointIconEnum,
  MapPointKindEnum,
  MapZoneStatusEnum,
} from '@/modules/map/constants'

export type MapUdrZone = {
  OBJECTID: number
  Nazov: string
  Zakladna_cena: number // 2
  Cas_spoplatnenia_en: string // "8-24"
  Cas_spoplatnenia_sk: string // "8-24"
  Casove_obmedzenie_dlzky_park: number // 0
  Doplnkova_informacia_en: string // "Bonus parking card cannot be used in this segment"
  Doplnkova_informacia_sk: string // "V tomto úseku nie je možné využiť bonusovú parkovaciu kartu"
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

export type NormalizedUdrZone = {
  /** OBJECTID */
  id: number
  name: string
  price: number
  paidHours: string
  parkingDurationLimit: number
  additionalInformation: string
  rpkInformation: string
  npkInformation: string
  code: string
  status: string
  udrId: number
  odpRpk: string
  restrictionOnlyRpk: string
  residentialZoneName: string
  reservedParking: string
  initialFreeParkingDuration: number
  parkingDurationRestrictionException: string
  parkingFeeException: string
  layer: MapLayerEnum
}

export type MapInterestPoint = {
  Navigacia: string // "https://www.google.com/maps/place/Magistr%C3%A1t+hlavn%C3%A9ho+mesta+SR+Bratislavy/@48.1439423,17.1091824,234m/data=!3m3!1e3!4b1!5s0x476c89431d7c7795:0x4caf7acfb0ed99d7!4m5!3m4!1s0x476c89433d1bc761:0x6ad8016ef317f8f0!8m2!3d48.1439414!4d17.1097296"
  icon: MapPointIconEnum
  kind: MapPointKindEnum
  OBJECTID: number // 4
}

export type BranchPoint = MapInterestPoint & {
  Adresa: string // "Primaciálne nám. 1, 811 01 Bratislava"
  Miesto: string // "Magistrát hl. mesta SR Bratislavy"
  Nazov: string // "PAAS Centrum"
  Otvaracie_hodiny_en: string // "Mo 8:30-17:00, Tu-Th 8:30-16:00, Fr 8:30-15:00"
  Otvaracie_hodiny_sk: string // "Po 8:30-17:00, Ut-Št 8:30-16:00, Pi 8:30-15:00"
}

export type AssistantPoint = MapInterestPoint & {
  Rezidenstka_zona: string
  Interny_nazov: string
  web: string
}

export type PartnerPoint = MapInterestPoint & {
  adresa: string // "Jesenského 4"
  Miesto: string // "Magistrát hl. mesta SR Bratislavy"
  Nazov: string // "Talks kaviareň "
  Otvaracie_hodiny_en: string // "Mo-Th 7:15-18:00 Fr 7:15-19:00 Sa 9:00-19:00 Su 10:00-18:00"
  Otvaracie_hodiny_sk: string // "Otvaracie_hodiny_sk": "Po-Št 7:15-18:00 Pi 7:15-19:00 So 9:00-19:00 Ne 10:00-18:00"
  Predajne_miesto: string // "Talks kaviareň"
  web?: string // "ano"
}

export type ParkomatPoint = MapInterestPoint & {
  Datum_osadenia_en: string // '31.07.2023'
  Datum_osadenia_sk: string // '31.07.2023'
  Lokalita: string // 'Rigeleho x Paulínyho'
  Parkomat_ID: string // 'P0076'
  Rezidentska_zona: string // 'SM0'
  UDR: number // 1015
  Web: string // 'ano'
  Navigacia: never
}

export type GaragePoint = MapInterestPoint & {
  Adresa: string // "Námestie Martina Benku"
  Informacia_NPK_en: string // "Visitor parking fee: weekdays from 8am-6pm - €1.80/h, weekdays from 6pm-8am + weekends and holidays - €1.20/h."
  Informacia_NPK_sk: string // "Návštevnícke parkovné: pracovné dni od 08:00-18:00 - 1,80 €/h., pracovné dni od 18:00-08:00 + víkendy a sviatky - 1,20 €/h. "
  Informacia_RPK_en: string // "For SM1 resident parking card holders - weekdays 5pm-8am + weekends and holidays are free."
  Informacia_RPK_sk: string // "Pre držiteľov rezidentskej parkovacej karty SM1 - pracovné dni 17:00-08:00 + víkendy a sviatky zadarmo."
  Nazov_en: string // "Underground garage Krížna"
  Nazov_sk: string // "Podzemná garáž Krížna"
  Povrch_en: string // "underground parking"
  Povrch_sk: string // "podzemná garáž"
  Prevadzkova_doba: string // "Nonstop"
  Stav_en: string // "existing"
  Stav_sk: string // "existujúce"
  Typ_en: string // "garage"
  Typ_sk: string // "garáž"
  web?: string // Optional field
  zone: string // "SM1"
}

export type PPlusRPoinit = MapInterestPoint & {
  Dojazdova_doba: string // "23 min"
  Nazov_en: string // "P+R Tesco Lamač"
  Nazov_sk: string // "P+R Tesco Lamač"
  Pocet_parkovacich_miest: string // "33"
  Povrch_en: string // "parking lot"
  Povrch_sk: string // "parkovisko"
  Prevadzkova_doba: string // "Neobmedzene"
  Stav_en: string // "existing"
  Stav_sk: string // "existujúce"
  Typ_en: string // "P+R"
  Typ_sk: string // "P+R"
  Verejna_doprava: string // "20, 37, 45, 63, 130"
  Vzdialenost: string // "<100 m"
  web?: string // Optional field
  icon: string // "p-plus-r"
  kind: string // "p-plus-r"
}

export type ParkingLotPoint = MapInterestPoint & {
  Dojazdova_doba: string // "4 min"
  Nazov_en: string // "Parking lot Černyševského"
  Nazov_sk: string // "Záchytné parkovisko Černyševského"
  Pocet_parkovacich_miest: string // "59"
  Povrch_en: string // "parking lot"
  Povrch_sk: string // "parkovisko"
  Prevadzkova_doba: string // "V pracovné dni: Od 05:00-24:00 pre návštevníkov zadarmo. Od 00:00-05:00 len pre držiteľov rezidentskej karty.\nVíkendy: zadarmo."
  Stav_en: string // "new"
  Stav_sk: string // "nové"
  Typ_en: string // "parking lot"
  Typ_sk: string // "parkovisko"
  Verejna_doprava: string // "3, 84, 95, 99"
  Vzdialenost: string // ">500 m"
  web?: string // Optional field
  icon: string // "parking-lot"
  kind: string // "parking-lots"
  zone: string // "PE1"
}

export type NormalizedPoint = {
  id: number
  name: string
  navigation?: string
  openingHours?: string
  kind: MapPointKindEnum
  address?: string
  parkingSpotCount?: number
  publicTransportLines?: string
  distanceToCenter?: string
  distanceToPublicTransport?: string
}

type PointTypes = {
  [MapPointKindEnum.assistant]: AssistantPoint
  [MapPointKindEnum.branch]: BranchPoint
  [MapPointKindEnum.parkomat]: ParkomatPoint
  [MapPointKindEnum.partner]: PartnerPoint
  [MapPointKindEnum.pPlusR]: PPlusRPoinit
  [MapPointKindEnum.garage]: GaragePoint
  [MapPointKindEnum.parkingLot]: ParkingLotPoint
}

// Type guard function using conditional types
export function isPointOfKind<T extends MapPointKindEnum>(
  point: MapInterestPoint,
  kind: T,
): point is PointTypes[T] {
  return point?.kind === kind
}

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
