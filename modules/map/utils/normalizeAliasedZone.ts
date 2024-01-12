import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { MapLayerEnum } from '@/modules/map/constants'
import { MapUdrZoneWithTranslationProps } from '@/modules/map/types'

export const normalizeAliasedZone = (
  zone: ArcgisAliased.UdrZone,
): MapUdrZoneWithTranslationProps => {
  const normalizedZone: MapUdrZoneWithTranslationProps = {
    id: zone.OBJECTID,
    name: zone.Názov,
    price: zone['Cena (eur/h)'],
    weekendsAndHolidaysPrice: zone['Víkendy a sviatky'],
    paidHours: { en: zone['Čas spoplatnenia (en)'], sk: zone['Čas spoplatnenia (sk)'] },
    parkingDurationLimit: zone['Časové obmedzenie dĺžky parkovania (min)'],
    additionalInformation: {
      en: zone['Doplnková informácia (en)'],
      sk: zone['Doplnková informácia (sk)'],
    },
    rpkInformation: { en: zone['Informácia RPK (en)'], sk: zone['Informácia RPK (sk)'] },
    npkInformation: { en: zone['Informácia NPK (en)'], sk: zone['Informácia NPK (sk)'] },
    code: zone['Kód rezidentskej zóny'],
    status: zone.Status,
    udrId: zone['UDR ID'].toString(),
    udrUuid: zone.GlobalID,
    odpRpk: zone['ODP Platnosť RPK a APK'],
    restrictionOnlyRpk: zone['Obmedzené len pre RPK, APK'],
    cityDistrict: zone['Mestská časť'],
    reservedParking: {
      en: zone['Vyhradené parkovacie státie (en)'],
      sk: zone['Vyhradené parkovacie státie (sk)'],
    },
    initialFreeParkingDuration: zone['Úvodný bezplatný čas parkovania (min)'],
    parkingDurationRestrictionException: zone['Výnimka z obmedzenia dĺžky parkovania (RPK, APK)'],
    parkingFeeException: zone['Výnimka zo spoplatnenia (RPK, APK)'],
    layer: zone.layer as MapLayerEnum,
  }

  return normalizedZone
}
