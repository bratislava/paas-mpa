import { MapLayerEnum } from '@/modules/map/constants'
import { MapUdrZone, NormalizedUdrZone } from '@/modules/map/types'
import {
  mapObjectPropertiesProxyHandler,
  PreProxy,
} from '@/modules/map/utils/mapObjectPropertiesProxyHandler'

export const normalizeZone = (zone: MapUdrZone): NormalizedUdrZone => {
  const normalizedZone: PreProxy<NormalizedUdrZone> = {
    id: zone.OBJECTID,
    name: zone.Nazov,
    price: zone.Zakladna_cena,
    paidHours: { en: zone.Cas_spoplatnenia_en, sk: zone.Cas_spoplatnenia_sk },
    parkingDurationLimit: zone.Casove_obmedzenie_dlzky_park,
    additionalInformation: { en: zone.Doplnkova_informacia_en, sk: zone.Doplnkova_informacia_sk },
    rpkInformation: { en: zone.Informacia_RPK_en, sk: zone.Informacia_RPK_sk },
    npkInformation: { en: zone.Informacia_NPK_en, sk: zone.Informacia_NPK_sk },
    code: zone.Kod_rezidentskej_zony,
    status: zone.Status,
    udrId: zone.UDR_ID.toString(),
    udrUuid: zone.GlobalID,
    odpRpk: zone.ODP_RPKAPK,
    restrictionOnlyRpk: zone.Obmedzene_len_pre_RPK_APK,
    cityDistrict: zone.UTJ,
    reservedParking: { en: zone.Vyhradene_park_statie_en, sk: zone.Vyhradene_park_statie_sk },
    initialFreeParkingDuration: zone.Uvodny_bezplatny_cas_parkovan,
    parkingDurationRestrictionException: zone.Vynimka_z_obmedzenia_dlzky_pa,
    parkingFeeException: zone.Vynimka_zo_spoplatnenia,
    layer: zone.layer as MapLayerEnum,
  }

  return new Proxy(normalizedZone, mapObjectPropertiesProxyHandler) as NormalizedUdrZone
}
