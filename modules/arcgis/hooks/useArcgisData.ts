import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import { ARCGIS_URL } from '@/modules/arcgis/constants'
import { useArcgis } from '@/modules/arcgis/hooks/useArcgis'
import { ArcgisData } from '@/modules/arcgis/types'
import {
  BranchPoint,
  MapUdrZone,
  ParkingPoint,
  ParkomatPoint,
  PartnerPoint,
} from '@/modules/map/types'

export const useArcgisData = (): ArcgisData => {
  const { data: rawZonesData } = useArcgis(`${ARCGIS_URL}/parkovanie/Hranica_RZ/MapServer/1`, {
    format: 'geojson',
  })

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
    rawParkomatsData: rawParkomatsData as FeatureCollection<Point, ParkomatPoint> | undefined,
    rawPartnersData: rawPartnersData as FeatureCollection<Point, PartnerPoint> | undefined,
    rawParkingLotsData: rawParkingLotsData as FeatureCollection<Point, ParkingPoint> | undefined,
    rawBranchesData: rawBranchesData as FeatureCollection<Point, BranchPoint> | undefined,
    rawUdrData: rawUdrData as FeatureCollection<Polygon, MapUdrZone> | undefined,
    rawOdpData: rawOdpData as FeatureCollection<Polygon, GeoJsonProperties> | undefined,
    rawZonesData: rawZonesData as FeatureCollection<Polygon, GeoJsonProperties> | undefined,
  }
}
