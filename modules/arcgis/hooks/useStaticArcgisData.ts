import { useQuery } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { FeatureCollection, GeoJsonProperties, Point, Polygon } from 'geojson'

import { ArcgisAliased } from '@/modules/arcgis/aliasedTypes'
import { STATIC_ARCGIS_URL } from '@/modules/arcgis/constants'
import { Arcgis, ArcgisData } from '@/modules/arcgis/types'
import { storage } from '@/utils/mmkv'

/**
 * Function to fetch a file from the static arcgis server or get it from the cache
 * @param fileName name of the file to fetch
 * @returns Promise with the file response
 */
async function fetchFileOrGetFromCache<T>(fileName: string): Promise<AxiosResponse<T>> {
  const url = `${STATIC_ARCGIS_URL}/${fileName}`

  const cachedResponse = storage.getString(url)

  if (cachedResponse) {
    const cachedParsedResponse = JSON.parse(cachedResponse) as AxiosResponse<T>
    try {
      const responseHeaders = await axios.head<T>(url)

      // Etag is an identifier for a specific version of a resource.
      // If the etag is the same, we can use the cached response
      if (responseHeaders.headers.etag === cachedParsedResponse?.headers?.etag) {
        return cachedParsedResponse
      }
    } catch (error) {
      // TODO log error
      return cachedParsedResponse
    }
  }

  const response = await axios.get<T>(url)

  storage.set(url, JSON.stringify(response))

  return response
}

/**
 * Function to calculate the milliseconds till midnight + 5 minutes to refetch data each day in case of not closing app
 * @returns milliseconds till midnight
 */
const calculateMillisecondsTillMidnight = () => {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  return midnight.getTime() - now.getTime() + 5 * 60 * 1000
}

export const useStaticArcgisData = (): Partial<ArcgisData> => {
  const { data: rawZonesData } = useQuery({
    queryKey: ['RawZonesData'],
    queryFn: () =>
      fetchFileOrGetFromCache<FeatureCollection<Polygon, GeoJsonProperties>>('okp.geojson'),
    select: (data) => data.data,
    refetchInterval: calculateMillisecondsTillMidnight,
  })

  const { data: rawParkomatsData } = useQuery({
    queryKey: ['RawParkomatsData'],
    queryFn: () =>
      fetchFileOrGetFromCache<
        FeatureCollection<Point, Arcgis.ParkomatPoint | ArcgisAliased.ParkomatPoint>
      >('parkomaty.geojson'),
    select: (data) => data.data,
    refetchInterval: calculateMillisecondsTillMidnight,
  })

  const { data: rawPartnersData } = useQuery({
    queryKey: ['RawPartnersData'],
    queryFn: () =>
      fetchFileOrGetFromCache<
        FeatureCollection<Point, Arcgis.PartnerPoint | ArcgisAliased.PartnerPoint>
      >('partnerske_prevadzky.geojson'),
    select: (data) => data.data,
    refetchInterval: calculateMillisecondsTillMidnight,
  })

  const { data: rawParkingLotsData } = useQuery({
    queryKey: ['RawParkingLotsData'],
    queryFn: () =>
      fetchFileOrGetFromCache<
        FeatureCollection<Point, Arcgis.ParkingPoint | ArcgisAliased.ParkingPoint>
      >('parkoviska.geojson'),
    select: (data) => data.data,
    refetchInterval: calculateMillisecondsTillMidnight,
  })

  const { data: rawBranchesData } = useQuery({
    queryKey: ['RawBranchesData'],
    queryFn: () =>
      fetchFileOrGetFromCache<
        FeatureCollection<Point, Arcgis.BranchPoint | ArcgisAliased.BranchPoint>
      >('pobocky.geojson'),
    select: (data) => data.data,
    refetchInterval: calculateMillisecondsTillMidnight,
  })

  const { data: rawUdrData } = useQuery({
    queryKey: ['RawUdrData'],
    queryFn: () =>
      fetchFileOrGetFromCache<FeatureCollection<Polygon, Arcgis.UdrZone | ArcgisAliased.UdrZone>>(
        'udr_p.geojson',
      ),
    select: (data) => data.data,
    refetchInterval: calculateMillisecondsTillMidnight,
  })

  const { data: rawOdpData } = useQuery({
    queryKey: ['RawOdpData'],
    queryFn: () =>
      fetchFileOrGetFromCache<FeatureCollection<Polygon, GeoJsonProperties>>('odp.geojson'),
    select: (data) => data.data,
    refetchInterval: calculateMillisecondsTillMidnight,
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
