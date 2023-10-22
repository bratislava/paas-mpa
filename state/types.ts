import { Feature, Polygon } from 'geojson'

import { MapUdrZone } from '@/modules/map/types'

export type MapZoneHashMapValue = Feature<Polygon, MapUdrZone>

export type TicketPriceRequest = {
  ecv?: string
  udr?: string
  duration?: number
  parkingEnd?: string
  npkId?: string
  bpkId?: string
}
