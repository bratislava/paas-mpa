import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import {
  BranchPoint,
  ParkingLotPoint,
  ParkomatPoint,
  PartnerPoint,
  SelectedPoint,
  SelectedUdrZone,
} from '@/modules/map/types'

import { ARCGIS_URL } from '../constants'
import { useArcgis } from './useArcgis'

export const useArcgisData = () => {
  const { data: rawZonesData } = useArcgis(`${ARCGIS_URL}/parkovanie/Hranica_RZ/MapServer/1`, {
    format: 'geojson',
  })

  const { data: rawAssistantsData } = useArcgis(
    `${ARCGIS_URL}/doprava/Asistenti_PAAS/MapServer/51`,
    { format: 'geojson' },
  )

  const { data: rawParkomatsData } = useArcgis(`${ARCGIS_URL}/doprava/Parkomaty/MapServer/17`, {
    format: 'geojson',
  })

  const { data: rawPartnersData } = useArcgis(
    `${ARCGIS_URL}/parkovanie/Zmluvn%C3%AD_partneri_PAAS/MapServer/128`,
    { format: 'geojson' },
  )

  const { data: rawParkingLotsData } = useArcgis(
    `${ARCGIS_URL}/parkovanie/Parkovisk%C3%A1/MapServer/118`,
    { format: 'geojson' },
  )

  const { data: rawBranchesData } = useArcgis(
    `${ARCGIS_URL}/parkovanie/Pobo%C4%8Dka/MapServer/87`,
    { format: 'geojson' },
  )

  const { data: rawUdrData } = useArcgis(`${ARCGIS_URL}/parkovanie/UDR_P/MapServer/40`, {
    format: 'geojson',
  })

  const { data: rawOdpData } = useArcgis(`${ARCGIS_URL}/parkovanie/ODP/MapServer/3`, {
    format: 'geojson',
  })

  return {
    rawAssistantsData: rawAssistantsData as FeatureCollection<
      Point,
      SelectedPoint & { web: string }
    >,
    rawParkomatsData: rawParkomatsData as FeatureCollection<Point, ParkomatPoint>,
    rawPartnersData: rawPartnersData as FeatureCollection<Point, PartnerPoint>,
    rawParkingLotsData: rawParkingLotsData as FeatureCollection<Point, ParkingLotPoint>,
    rawBranchesData: rawBranchesData as FeatureCollection<Point, BranchPoint>,
    rawUdrData: rawUdrData as FeatureCollection<Polygon, SelectedUdrZone>,
    rawOdpData: rawOdpData as FeatureCollection<Polygon, GeoJsonProperties>,
    rawZonesData: rawZonesData as FeatureCollection<Polygon, GeoJsonProperties>,
  }
}
