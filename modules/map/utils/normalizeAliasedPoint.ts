import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { MapPointKindEnum } from '@/modules/map/constants'
import { MapPointWithTranslationProps } from '@/modules/map/types'

export const normalizeAliasedPoint = (
  point: ArcgisAliased.MapPoint,
): MapPointWithTranslationProps => {
  let normalizedPoint: MapPointWithTranslationProps
  switch (true) {
    case ArcgisAliased.isPointOfKind(point, MapPointKindEnum.branch):
      normalizedPoint = {
        id: point.OBJECTID,
        address: point.Adresa,
        kind: point.kind,
        icon: point.icon,
        name: point.Názov,
        place: point.Miesto,
        navigation: point.Navigácia,
        addressDetail: {
          sk: point['Spresňujúce informácie (sk)'],
          en: point['Spresňujúce informácie (en)'],
        },
        openingHours: { sk: point['Otváracie hodiny (sk)'], en: point['Otváracie hodiny (en)'] },
      }
      break
    case ArcgisAliased.isPointOfKind(point, MapPointKindEnum.garage):
    case ArcgisAliased.isPointOfKind(point, MapPointKindEnum.pPlusR):
    case ArcgisAliased.isPointOfKind(point, MapPointKindEnum.parkingLot):
      normalizedPoint = {
        id: point.OBJECTID,
        kind: point.kind,
        icon: point.icon,
        address: point.Adresa,
        name: { sk: point['Názov (sk)'], en: point['Názov (en)'] },
        navigation: point.Navigácia,
        openingHours: point['Prevádzkova doba'],
        distanceToPublicTransport: point['Vzdialenosť k verejnej doprave'],
        parkingSpotCount: point['Počet parkovacích miest']
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Number.parseInt(point['Počet parkovacích miest'], 10)
          : undefined,
        publicTransportLines: point['Verejná doprava'],
        publicTransportTravelTime: point['Dojazdová doba do centra'],
        rpkInformation: { sk: point['Informácia RPK (sk)'], en: point['Informácia RPK (en)'] },
        npkInformation: { sk: point['Informácia NPK (sk)'], en: point['Informácia NPK (en)'] },
        surface: { sk: point['Povrch (sk)'], en: point['Povrch (en)'] },
      }
      break
    case ArcgisAliased.isPointOfKind(point, MapPointKindEnum.parkomat):
      normalizedPoint = {
        id: point.OBJECTID,
        parkomatId: point['Parkomat ID'],
        kind: point.kind,
        icon: point.icon,
        location: point.Lokalita,
        name: point.Lokalita,
      }
      break
    case ArcgisAliased.isPointOfKind(point, MapPointKindEnum.partner):
      normalizedPoint = {
        id: point.OBJECTID,
        address: point.Adresa,
        kind: point.kind,
        icon: point.icon,
        name: point.Názov,
        navigation: point.Navigácia,
        openingHours: { sk: point['Otváracie hodiny (sk)'], en: point['Otváracie hodiny (en)'] },
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
