import { Feature, Polygon } from 'geojson'

import { MapUdrZone } from '@/modules/map/types'

export type MapFeatureHashMap = Map<string, Feature<Polygon, MapUdrZone>>
