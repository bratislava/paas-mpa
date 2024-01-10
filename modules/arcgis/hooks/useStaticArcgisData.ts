import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { STATIC_ARCGIS_URL } from '@/modules/arcgis/constants'
import { Arcgis, ArcgisData } from '@/modules/arcgis/types'

export const useStaticArcgisData = (): Partial<ArcgisData> => {
  const { data: rawZonesData } = useQuery({
    queryKey: ['RawZonesData'],
    queryFn: () =>
      axios.get<FeatureCollection<Polygon, GeoJsonProperties>>(`${STATIC_ARCGIS_URL}/okp.geojson`),
    select: (data) => data.data,
  })

  const { data: rawParkomatsData } = useQuery({
    queryKey: ['RawParkomatsData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, Arcgis.ParkomatPoint | ArcgisAliased.ParkomatPoint>>(
        `${STATIC_ARCGIS_URL}/parkomaty.geojson`,
      ),
    select: (data) => data.data,
  })

  const { data: rawPartnersData } = useQuery({
    queryKey: ['RawPartnersData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, Arcgis.PartnerPoint | ArcgisAliased.PartnerPoint>>(
        `${STATIC_ARCGIS_URL}/partneri.geojson`,
      ),
    select: (data) => data.data,
  })

  const { data: rawParkingLotsData } = useQuery({
    queryKey: ['RawParkingLotsData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, Arcgis.ParkingPoint | ArcgisAliased.ParkingPoint>>(
        `${STATIC_ARCGIS_URL}/parkoviska.geojson`,
      ),
    select: (data) => data.data,
  })

  const { data: rawBranchesData } = useQuery({
    queryKey: ['RawBranchesData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, Arcgis.BranchPoint | ArcgisAliased.BranchPoint>>(
        `${STATIC_ARCGIS_URL}/pobocky.geojson`,
      ),
    select: (data) => data.data,
  })

  const { data: rawUdrData } = useQuery({
    queryKey: ['RawUdrData'],
    queryFn: () =>
      axios.get<FeatureCollection<Polygon, Arcgis.UdrZone | ArcgisAliased.UdrZone>>(
        `${STATIC_ARCGIS_URL}/udr_p.geojson`,
      ),
    select: (data) => data.data,
  })

  const { data: rawOdpData } = useQuery({
    queryKey: ['RawOdpData'],
    queryFn: () =>
      axios.get<FeatureCollection<Polygon, GeoJsonProperties>>(`${STATIC_ARCGIS_URL}/odp.geojson`),
    select: (data) => data.data,
  })

  return {
    rawParkomatsData,
    rawPartnersData,
    rawParkingLotsData,
    rawBranchesData,
    rawUdrData,
    rawOdpData,
    rawZonesData,
  }
}
