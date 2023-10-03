/* eslint-disable babel/camelcase */
import { MapPointKindEnum } from '../constants'
import { isPointOfKind, NormalizedPoint, SelectedPoint } from '../types'

export const normalizePoint = (point: SelectedPoint, language: string): NormalizedPoint => {
  const resolveOpeningHours = (resolvingPoint: {
    Otvaracie_hodiny_en: string
    Otvaracie_hodiny_sk: string
  }) =>
    language === 'en' ? resolvingPoint.Otvaracie_hodiny_en : resolvingPoint.Otvaracie_hodiny_sk

  const resolveName = (resolvingPoint: { Nazov_en: string; Nazov_sk: string }) =>
    language === 'en' ? resolvingPoint.Nazov_en : resolvingPoint.Nazov_sk

  if (isPointOfKind(point, MapPointKindEnum.branch)) {
    return {
      id: point.OBJECTID,
      address: point.Adresa,
      kind: point.kind,
      name: point.Nazov,
      navigation: point.Navigacia,
      openingHours: resolveOpeningHours(point),
    }
  }
  if (isPointOfKind(point, MapPointKindEnum.garage)) {
    return {
      id: point.OBJECTID,
      address: point.Adresa,
      kind: point.kind,
      name: resolveName(point),
      navigation: point.Navigacia,
      openingHours: point.Prevadzkova_doba,
    }
  }
  if (isPointOfKind(point, MapPointKindEnum.pPlusR)) {
    return {
      id: point.OBJECTID,
      kind: point.kind,
      name: resolveName(point),
      navigation: point.Navigacia,
      openingHours: point.Prevadzkova_doba,
      distanceToCenter: point.Dojazdova_doba,
      distanceToPublicTransport: point.Vzdialenost,
      parkingSpotCount: Number.parseInt(point.Pocet_parkovacich_miest, 10),
      publicTransportLines: point.Verejna_doprava,
    }
  }
  if (isPointOfKind(point, MapPointKindEnum.parkingLot)) {
    return {
      id: point.OBJECTID,
      kind: point.kind,
      name: resolveName(point),
      navigation: point.Navigacia,
      openingHours: point.Prevadzkova_doba,
      distanceToCenter: point.Dojazdova_doba,
      distanceToPublicTransport: point.Vzdialenost,
      parkingSpotCount: Number.parseInt(point.Pocet_parkovacich_miest, 10),
      publicTransportLines: point.Verejna_doprava,
    }
  }
  if (isPointOfKind(point, MapPointKindEnum.parkomat)) {
    return {
      id: point.OBJECTID,
      kind: point.kind,
      name: point.Lokalita,
    }
  }
  if (isPointOfKind(point, MapPointKindEnum.partner)) {
    return {
      id: point.OBJECTID,
      address: point.adresa,
      kind: point.kind,
      name: point.Nazov,
      navigation: point.Navigacia,
      openingHours: resolveOpeningHours(point),
    }
  }
  if (isPointOfKind(point, MapPointKindEnum.assistant)) {
    return {
      id: 0,
      name: 'N/A',
      kind: point.kind,
    }
  }

  return {
    id: 0,
    name: 'N/A',
    kind: point.kind,
  }
}
