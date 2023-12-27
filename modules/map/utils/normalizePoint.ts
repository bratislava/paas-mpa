/* eslint-disable babel/camelcase */

import { MapPointKindEnum } from '@/modules/map/constants'
import { isPointOfKind, MapInterestPoint, NormalizedPoint } from '@/modules/map/types'

export const normalizePoint = (point: MapInterestPoint, language: string): NormalizedPoint => {
  const resolveOpeningHours = (resolvingPoint: {
    Otvaracie_hodiny_en: string
    Otvaracie_hodiny_sk: string
  }) =>
    language === 'sk' ? resolvingPoint.Otvaracie_hodiny_sk : resolvingPoint.Otvaracie_hodiny_en

  const resolveName = (resolvingPoint: { Nazov_en: string; Nazov_sk: string }) =>
    language === 'sk' ? resolvingPoint.Nazov_sk : resolvingPoint.Nazov_en

  switch (true) {
    case isPointOfKind(point, MapPointKindEnum.branch):
      return {
        id: point.OBJECTID,
        address: point.Adresa,
        kind: point.kind,
        name: point.Nazov,
        place: point.Miesto,
        navigation: point.Navigacia,
        addressDetail:
          language === 'sk' ? point.Spresnujuce_informacie_sk : point.Spresnujuce_informacie_en,
        openingHours: resolveOpeningHours(point),
      }
    case isPointOfKind(point, MapPointKindEnum.garage):
    case isPointOfKind(point, MapPointKindEnum.pPlusR):
    case isPointOfKind(point, MapPointKindEnum.parkingLot):
      return {
        id: point.OBJECTID,
        kind: point.kind,
        address: point.Adresa,
        name: resolveName(point),
        navigation: point.Navigacia,
        openingHours: point.Prevadzkova_doba,
        distanceToCenter: point.Dojazdova_doba,
        distanceToPublicTransport: point.Vzdialenost,
        parkingSpotCount: point.Pocet_parkovacich_miest
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Number.parseInt(point.Pocet_parkovacich_miest, 10)
          : undefined,
        publicTransportLines: point.Verejna_doprava,
        publicTransportTravelTime: point.Dojazdova_doba,
        rpkInformation: language === 'sk' ? point.Informacia_RPK_sk : point.Informacia_RPK_en,
        npkInformation: language === 'sk' ? point.Informacia_NPK_sk : point.Informacia_NPK_en,
      }
    case isPointOfKind(point, MapPointKindEnum.parkomat):
      return {
        id: point.OBJECTID,
        parkomatId: point.Parkomat_ID,
        kind: point.kind,
        location: point.Lokalita,
        name: point.Lokalita,
      }
    case isPointOfKind(point, MapPointKindEnum.partner):
      return {
        id: point.OBJECTID,
        address: point.adresa,
        kind: point.kind,
        name: point.Nazov,
        navigation: point.Navigacia,
        openingHours: resolveOpeningHours(point),
      }
    case isPointOfKind(point, MapPointKindEnum.assistant):
      return {
        id: point.OBJECTID,
        name: point.Interny_nazov,
        udrId: point.Rezidenstka_zona,
        kind: MapPointKindEnum.assistant,
      }
    default:
      return {
        id: 0,
        name: 'N/A',
        kind: point.kind,
      }
  }
}
