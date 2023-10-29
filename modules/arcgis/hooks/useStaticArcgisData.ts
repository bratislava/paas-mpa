import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import { STATIC_ARCGIS_URL } from '@/modules/arcgis/constants'
import { ArcgisData } from '@/modules/arcgis/types'
import {
  AssistantPoint,
  BranchPoint,
  MapUdrZone,
  ParkingLotPoint,
  ParkomatPoint,
  PartnerPoint,
} from '@/modules/map/types'

export const useStaticArcgisData = (): ArcgisData => {
  const { data: rawZonesData } = useQuery({
    queryKey: ['RawZonesData'],
    queryFn: () =>
      axios.get<FeatureCollection<Polygon, GeoJsonProperties>>(
        `${STATIC_ARCGIS_URL}/udr_p.geojson`,
      ),
    select: (data) => data.data,
  })

  const { data: rawAssistantsData } = useQuery({
    queryKey: ['RawAssistantsData'],
    queryFn: () => axios.get<FeatureCollection<Point, AssistantPoint>>(`${STATIC_ARCGIS_URL}`),
    select: (data) => data.data,
  })

  const { data: rawParkomatsData } = useQuery({
    queryKey: ['RawParkomatsData'],
    queryFn: () => axios.get<FeatureCollection<Point, ParkomatPoint>>(`${STATIC_ARCGIS_URL}`),
    select: (data) => data.data,
  })

  const { data: rawPartnersData } = useQuery({
    queryKey: ['RawPartnersDat'],
    queryFn: () => axios.get<FeatureCollection<Point, PartnerPoint>>(`${STATIC_ARCGIS_URL}`),
    select: (data) => data.data,
  })

  const { data: rawParkingLotsData } = useQuery({
    queryKey: ['RawParkingLotsData'],
    queryFn: () => axios.get<FeatureCollection<Point, ParkingLotPoint>>(`${STATIC_ARCGIS_URL}`),
    select: (data) => data.data,
  })

  const { data: rawBranchesData } = useQuery({
    queryKey: ['RawBranchesData'],
    queryFn: () => axios.get<FeatureCollection<Point, BranchPoint>>(`${STATIC_ARCGIS_URL}`),
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
    queryFn: () => axios.get<FeatureCollection<Polygon, GeoJsonProperties>>(`${STATIC_ARCGIS_URL}`),
    select: (data) => data.data,
  })

  return {
    rawAssistantsData,
    rawParkomatsData,
    rawPartnersData,
    rawParkingLotsData,
    rawBranchesData,
    rawUdrData,
    rawOdpData,
    rawZonesData,
  }
}
