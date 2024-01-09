import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import { STATIC_ARCGIS_URL } from '@/modules/arcgis/constants'
import { ArcgisData } from '@/modules/arcgis/types'
import {
  BranchPoint,
  MapUdrZone,
  ParkingPoint,
  ParkomatPoint,
  PartnerPoint,
} from '@/modules/map/types'

export const useStaticArcgisData = (): ArcgisData => {
  const { data: rawZonesData } = useQuery({
    queryKey: ['RawZonesData'],
    queryFn: () =>
      axios.get<FeatureCollection<Polygon, GeoJsonProperties>>(`${STATIC_ARCGIS_URL}/okp.geojson`),
    select: (data) => data.data,
  })

  const { data: rawParkomatsData } = useQuery({
    queryKey: ['RawParkomatsData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, ParkomatPoint>>(`${STATIC_ARCGIS_URL}/parkomaty.geojson`),
    select: (data) => data.data,
  })

  const { data: rawPartnersData } = useQuery({
    queryKey: ['RawPartnersData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, PartnerPoint>>(
        `${STATIC_ARCGIS_URL}/partnerske_prevadzky.geojson`,
      ),
    select: (data) => data.data,
  })

  const { data: rawParkingLotsData } = useQuery({
    queryKey: ['RawParkingLotsData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, ParkingPoint>>(`${STATIC_ARCGIS_URL}/parkoviska.geojson`),
    select: (data) => data.data,
  })

  const { data: rawBranchesData } = useQuery({
    queryKey: ['RawBranchesData'],
    queryFn: () =>
      axios.get<FeatureCollection<Point, BranchPoint>>(`${STATIC_ARCGIS_URL}/pobocky.geojson`),
    select: (data) => data.data,
  })

  const { data: rawUdrData } = useQuery({
    queryKey: ['RawUdrData'],
    queryFn: () =>
      axios.get<FeatureCollection<Polygon, MapUdrZone>>(`${STATIC_ARCGIS_URL}/udr_p.geojson`),
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
