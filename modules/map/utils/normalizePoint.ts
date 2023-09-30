import i18n from '@/i18n.config'

import { KindsEnum } from '../constants'
import { isPointOfType, NormalizedPoint, SelectedPoint } from '../types'

// eslint-disable-next-line babel/camelcase
const resolveOpeningHours = (point: { Otvaracie_hodiny_en: string; Otvaracie_hodiny_sk: string }) =>
  i18n.language === 'en' ? point.Otvaracie_hodiny_en : point.Otvaracie_hodiny_sk

// eslint-disable-next-line babel/camelcase
const resolveName = (point: { Nazov_en: string; Nazov_sk: string }) =>
  i18n.language === 'en' ? point.Nazov_en : point.Nazov_sk

export const normalizePoint = (point: SelectedPoint): NormalizedPoint => {
  if (isPointOfType(point, KindsEnum.branch)) {
    return {
      address: point.Adresa,
      kind: point.kind,
      name: point.Nazov,
      navigation: point.Navigacia,
      openingHours: resolveOpeningHours(point),
    }
  }
  if (isPointOfType(point, KindsEnum.garage)) {
    return {
      address: point.Adresa,
      kind: point.kind,
      name: resolveName(point),
      navigation: point.Navigacia,
      openingHours: point.Prevadzkova_doba,
    }
  }
  if (isPointOfType(point, KindsEnum.pPlusR)) {
    return {
      address: undefined,
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
  if (isPointOfType(point, KindsEnum.parkingLot)) {
    return {
      address: undefined,
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
  if (isPointOfType(point, KindsEnum.parkomat)) {
    return {
      address: undefined,
      kind: point.kind,
      name: point.Lokalita,
      navigation: undefined,
      openingHours: undefined,
    }
  }
  if (isPointOfType(point, KindsEnum.partner)) {
    return {
      address: point.adresa,
      kind: point.kind,
      name: point.Nazov,
      navigation: point.Navigacia,
      openingHours: resolveOpeningHours(point),
    }
  }
  if (isPointOfType(point, KindsEnum.assistant)) {
    return {
      kind: point.kind,
    }
  }

  return {
    kind: point.kind,
  }
}
