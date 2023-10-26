import { Feature, Polygon } from 'geojson'

import { MapUdrZone } from '@/modules/map/types'

export type MapZoneHashMapValue = Feature<Polygon, MapUdrZone>
