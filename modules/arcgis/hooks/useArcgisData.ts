import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import { ARCGIS_URL } from '@/modules/arcgis/constants'
import { useArcgis } from '@/modules/arcgis/hooks/useArcgis'
import { Arcgis } from '@/modules/arcgis/types'

export const useArcgisData = (): Arcgis.RawData => {
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
    rawParkomatsData: rawParkomatsData as
      | FeatureCollection<Point, Arcgis.ParkomatPoint>
      | undefined,
    rawPartnersData: rawPartnersData as FeatureCollection<Point, Arcgis.PartnerPoint> | undefined,
    rawParkingLotsData: rawParkingLotsData as
      | FeatureCollection<Point, Arcgis.ParkingPoint>
      | undefined,
    rawBranchesData: rawBranchesData as FeatureCollection<Point, Arcgis.BranchPoint> | undefined,
    rawUdrData: rawUdrData as FeatureCollection<Polygon, Arcgis.UdrZone> | undefined,
    rawOdpData: rawOdpData as FeatureCollection<Polygon, GeoJsonProperties> | undefined,
    rawZonesData: rawZonesData as FeatureCollection<Polygon, GeoJsonProperties> | undefined,
  }
}
