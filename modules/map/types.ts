/* eslint-disable babel/camelcase */

import { IconsEnum, KindsEnum } from './constants'

export type SelectedUdrZone = {
  Nazov: string
  Zakladna_cena: number // 2
  Cas_spoplatnenia_en: string // "8-24"
  Cas_spoplatnenia_sk: string // "8-24"
  Casove_obmedzenie_dlzky_park: number // 0
  Doplnkova_informacia_en: string // "Bonus parking card cannot be used in this segment"
  Doplnkova_informacia_sk: string // "V tomto úseku nie je možné využiť bonusovú parkovaciu kartu"
  Kod_rezidentskej_zony: string // "SM0"
  Status: string // "active"
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
} | null

// "Adresa": "Primaciálne nám. 1, 811 01 Bratislava", "Miesto": "Magistrát hl. mesta SR Bratislavy", "Navigacia": "https://www.google.com/maps/place/Magistr%C3%A1t+hlavn%C3%A9ho+mesta+SR+Bratislavy/@48.1439423,17.1091824,234m/data=!3m3!1e3!4b1!5s0x476c89431d7c7795:0x4caf7acfb0ed99d7!4m5!3m4!1s0x476c89433d1bc761:0x6ad8016ef317f8f0!8m2!3d48.1439414!4d17.1097296", "Nazov": "PAAS Centrum", "OBJECTID": 4, "Otvaracie_hodiny_en": "Mo 8:30-17:00, Tu-Th 8:30-16:00, Fr 8:30-15:00", "Otvaracie_hodiny_sk": "Po 8:30-17:00, Ut-Št 8:30-16:00, Pi 8:30-15:00", "icon": "branch", "kind": "branches"

// "Navigacia": "https://goo.gl/maps/FqPh8De9v3E2DjV48", "Nazov": "Talks kaviareň ", "OBJECTID": 63, "Otvaracie_hodiny_en": "Mo-Th 7:15-18:00 Fr 7:15-19:00 Sa 9:00-19:00 Su 10:00-18:00", "Otvaracie_hodiny_sk": "Po-Št 7:15-18:00 Pi 7:15-19:00 So 9:00-19:00 Ne 10:00-18:00", "Predajne_miesto": "Talks kaviareň ", "adresa": "Jesenského 4", "icon": "partner", "kind": "partners", "web": "ano"

// "Datum_osadenia_en": "31.07.2023", "Datum_osadenia_sk": "31.07.2023", "Lokalita": "Rigeleho x Paulínyho", "OBJECTID": 162, "Parkomat_ID": "P0076", "Rezidentska_zona": "SM0", "UDR": 1015, "Web": "ano", "icon": "parkomat", "kind": "parkomats"

// "Adresa": "Námestie Martina Benku", "Informacia_NPK_en": "Visitor parking fee: weekdays from 8am-6pm - €1.80/h, weekdays from 6pm-8am + weekends and holidays - €1.20/h.", "Informacia_NPK_sk": "Návštevnícke parkovné: pracovné dni od 08:00-18:00 - 1,80 €/h., pracovné dni od 18:00-08:00 + víkendy a sviatky - 1,20 €/h. ", "Informacia_RPK_en": "For SM1 resident parking card holders - weekdays 5pm-8am + weekends and holidays are free.", "Informacia_RPK_sk": "Pre držiteľov rezidentskej parkovacej karty SM1 - pracovné dni 17:00-08:00 + víkendy a sviatky zadarmo.", "Navigacia": "https://www.google.com/maps/place/Podzemn%C3%A9+parkovisko/@48.1531608,17.1220751,166m/data=!3m1!1e3!4m5!3m4!1s0x476c8997d28106c9:0x364bf343a9111eb6!8m2!3d48.1532471!4d17.1220575", "Nazov_en": "Underground garage Krížna", "Nazov_sk": "Podzemná garáž Krížna", "OBJECTID": 23, "Povrch_en": "underground parking", "Povrch_sk": "podzemná garáž", "Prevadzkova_doba": "Nonstop", "Stav_en": "existing", "Stav_sk": "existujúce", "Typ_en": "garage", "Typ_sk": "garáž", "icon": "garage", "kind": "garages", "web": "ano", "zone": "SM1"

// "Dojazdova_doba": "23 min", "Navigacia": "https://www.google.com/maps/@48.176567,17.0643259,57m/data=!3m1!1e3", "Nazov_en": "P+R Tesco Lamač", "Nazov_sk": "P+R Tesco Lamač", "OBJECTID": 26, "Pocet_parkovacich_miest": "33", "Povrch_en": "parking lot", "Povrch_sk": "parkovisko", "Prevadzkova_doba": "Neobmedzene", "Stav_en": "existing", "Stav_sk": "existujúce", "Typ_en": "P+R", "Typ_sk": "P+R", "Verejna_doprava": "20, 37, 45, 63, 130", "Vzdialenost": "<100 m", "icon": "p-plus-r", "kind": "p-plus-r", "web": "ano"

// "Dojazdova_doba": "4 min", "Navigacia": "https://www.google.com/maps/place/Parkovisko+%C4%8Cerny%C5%A1evsk%C3%A9ho/@48.1301808,17.1171949,220m/data=!3m1!1e3!4m14!1m8!3m7!1s0x0:0x73e7a623fba85a53!2zNDjCsDA3JzQ4LjkiTiAxN8KwMDcnMDEuNiJF!3b1!7e2!8m2!3d48.1302537!4d17.1171213!3m4!1s0x476c89d84e48ef8b", "Nazov_en": "Parking lot Černyševského", "Nazov_sk": "Záchytné parkovisko Černyševského", "OBJECTID": 7, "Pocet_parkovacich_miest": "59", "Povrch_en": "parking lot", "Povrch_sk": "parkovisko", "Prevadzkova_doba": "V pracovné dni: Od 05:00-24:00 pre návštevníkov zadarmo. Od 00:00-05:00 len pre držiteľov rezidentskej karty.\nVíkendy: zadarmo.", "Stav_en": "new", "Stav_sk": "nové", "Typ_en": "parking lot", "Typ_sk": "parkovisko", "Verejna_doprava": "3, 84, 95, 99", "Vzdialenost": ">500 m", "icon": "parking-lot", "kind": "parking-lots", "web": "ano", "zone": "PE1"

export type SelectedPoint = { Navigacia: string; icon: IconsEnum; kind: KindsEnum } | null

export type BranchPoint = SelectedPoint & { Nazov: string; Adresa: string; kind: KindsEnum.branch }

export type PartnerPoint = SelectedPoint & {
  Nazov: string
  adresa: string
  kind: KindsEnum.partner
}
export type GaragePoint = SelectedPoint & {
  Nazov_en: string
  Nazov_sk: string
  Adresa: string
  kind: KindsEnum.partner
}
