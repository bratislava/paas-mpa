/* eslint-disable babel/camelcase */

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

  type: 'zone' | 'point'
} | null
