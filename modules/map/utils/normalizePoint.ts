import { Arcgis } from '@/modules/arcgis/types'
import { MapPointKindEnum } from '@/modules/map/constants'
import { MapPointWithTranslationProps } from '@/modules/map/types'

export const normalizePoint = (point: Arcgis.MapPoint): MapPointWithTranslationProps => {
  let normalizedPoint: MapPointWithTranslationProps
  switch (true) {
    case Arcgis.isPointOfKind(point, MapPointKindEnum.branch):
      normalizedPoint = {
        id: point.OBJECTID,
        address: point.Adresa,
        kind: point.kind,
        icon: point.icon,
        name: point.Nazov,
        place: point.Miesto,
        navigation: point.Navigacia,
        addressDetail: { sk: point.Spresnujuce_informacie_sk, en: point.Spresnujuce_informacie_en },
        openingHours: { sk: point.Otvaracie_hodiny_sk, en: point.Otvaracie_hodiny_en },
      }
      break
    case Arcgis.isPointOfKind(point, MapPointKindEnum.garage):
    case Arcgis.isPointOfKind(point, MapPointKindEnum.pPlusR):
    case Arcgis.isPointOfKind(point, MapPointKindEnum.parkingLot):
      normalizedPoint = {
        id: point.OBJECTID,
        kind: point.kind,
        icon: point.icon,
        address: point.Adresa,
        name: { sk: point.Nazov_sk, en: point.Nazov_en },
        navigation: point.Navigacia,
        openingHours: point.Prevadzkova_doba,
        distanceToPublicTransport: point.Vzdialenost,
        parkingSpotCount: point.Pocet_parkovacich_miest
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Number.parseInt(point.Pocet_parkovacich_miest, 10)
          : undefined,
        publicTransportLines: point.Verejna_doprava,
        publicTransportTravelTime: point.Dojazdova_doba,
        rpkInformation: { sk: point.Informacia_RPK_sk, en: point.Informacia_RPK_en },
        npkInformation: { sk: point.Informacia_NPK_sk, en: point.Informacia_NPK_en },
        surface: { sk: point.Povrch_sk, en: point.Povrch_en },
      }
      break
    case Arcgis.isPointOfKind(point, MapPointKindEnum.parkomat):
      normalizedPoint = {
        id: point.OBJECTID,
        parkomatId: point.Parkomat_ID,
        kind: point.kind,
        icon: point.icon,
        location: point.Lokalita,
        name: point.Lokalita,
      }
      break
    case Arcgis.isPointOfKind(point, MapPointKindEnum.partner):
      normalizedPoint = {
        id: point.OBJECTID,
        address: point.adresa,
        kind: point.kind,
        icon: point.icon,
        name: point.Nazov,
        navigation: point.Navigacia,
        openingHours: { sk: point.Otvaracie_hodiny_sk, en: point.Otvaracie_hodiny_en },
      }
      break
    default:
      normalizedPoint = {
        id: 0,
        name: 'N/A',
        kind: point.kind,
        icon: point.icon,
      }
      break
  }

  return normalizedPoint
}
