import { MapLayerEnum } from '@/modules/map/constants'
import { NormalizedUdrZone, MapUdrZone } from '@/modules/map/types'

export const normalizeZone = (zone: MapUdrZone, language: string): NormalizedUdrZone => {
  const isEnglish = language === 'en'

  return {
    id: zone.OBJECTID,
    name: zone.Nazov,
    price: zone.Zakladna_cena,
    paidHours: isEnglish ? zone.Cas_spoplatnenia_en : zone.Cas_spoplatnenia_sk,
    parkingDurationLimit: zone.Casove_obmedzenie_dlzky_park,
    additionalInformation: isEnglish ? zone.Doplnkova_informacia_en : zone.Cas_spoplatnenia_sk,
    rpkInformation: isEnglish ? zone.Informacia_RPK_en : zone.Informacia_RPK_sk,
    npkInformation: isEnglish ? zone.Informacia_NPK_en : zone.Informacia_NPK_sk,
    code: zone.Kod_rezidentskej_zony,
    status: zone.Status,
    udrId: zone.UDR_ID,
    odpRpk: zone.ODP_RPKAPK,
    restrictionOnlyRpk: zone.Obmedzene_len_pre_RPK_APK,
    residentialZoneName: zone.UTJ,
    reservedParking: isEnglish ? zone.Vyhradene_park_statie_en : zone.Vyhradene_park_statie_sk,
    initialFreeParkingDuration: zone.Uvodny_bezplatny_cas_parkovan,
    parkingDurationRestrictionException: zone.Vynimka_z_obmedzenia_dlzky_pa,
    parkingFeeException: zone.Vynimka_zo_spoplatnenia,
    layer: zone.layer as MapLayerEnum,
  }
}
