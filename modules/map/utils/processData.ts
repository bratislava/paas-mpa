/* eslint-disable eslint-comments/no-unlimited-disable,unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import area from '@turf/area'
import booleanIntersects from '@turf/boolean-intersects'
import { Point, Polygon } from '@turf/helpers'
import intersect from '@turf/intersect'
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import {
  UdrZoneFeature,
  MapPointWithTranslationProps,
  MapUdrZoneWithTranslationProps,
} from '@/modules/map/types'
import { normalizePoint } from '@/modules/map/utils/normalizePoint'
import { MapLayerEnum, MapPointIconEnum, MapPointKindEnum } from '@/modules/map/constants'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { Arcgis } from '@/modules/arcgis/types'

const zoneMapping = {
  SM1: 'SM1',
  NM1a: 'NM1',
  RU1: 'RU1',
  RA1: 'RA1',
  'PE1-Dvory IV': 'PE1',
} as { [key: string]: string }

export const getIntersectionOfFeatureFromFeatures = <G extends Geometry>(
  feature: Feature<G>,
  featureCollection: FeatureCollection<Polygon>,
) => {
  const availableFeatures = featureCollection.features

  for (const availableFeature of availableFeatures) {
    if (feature.geometry.type === 'Polygon') {
      const intersection = intersect(availableFeature.geometry, feature as Feature<Polygon>)

      if (!intersection) {
        continue
      }

      if (area(intersection) > area(feature) / 2) {
        return availableFeature
      }
    }

    if (feature.geometry.type === 'Point' && booleanIntersects(availableFeature, feature)) {
      return availableFeature
    }
  }

  return null
}

export const addZonePropertyToLayer = <G extends Geometry, GJP extends GeoJsonProperties>(
  featureCollection: FeatureCollection<G, GJP>,
  zonesCollection: FeatureCollection<Polygon>,
): FeatureCollection<G, GJP> => ({
  ...featureCollection,
  features: featureCollection.features.map((feature) => {
    return {
      ...feature,
      properties: {
        ...feature.properties,
        zone: getIntersectionOfFeatureFromFeatures(feature, zonesCollection)?.properties?.zone,
      },
    }
  }),
})

export interface ProcessDataOptions {
  rawParkomatsData: FeatureCollection<Point, Arcgis.ParkomatPoint>
  rawPartnersData: FeatureCollection<Point, Arcgis.PartnerPoint>
  rawParkingLotsData: FeatureCollection<Point, Arcgis.ParkingPoint>
  rawBranchesData: FeatureCollection<Point, Arcgis.BranchPoint>
  rawUdrData: FeatureCollection<Polygon, Arcgis.UdrZone>
  rawOdpData: FeatureCollection<Polygon, GeoJsonProperties>
  rawZonesData: FeatureCollection<Polygon, GeoJsonProperties>
}

export const processData = ({
  rawZonesData,
  rawParkomatsData,
  rawPartnersData,
  rawParkingLotsData,
  rawBranchesData,
  rawUdrData,
  rawOdpData,
}: ProcessDataOptions) => {
  let GLOBAL_ID = 0

  const zonesData = {
    type: 'FeatureCollection',
    features: rawZonesData.features
      .map((feature) => {
        GLOBAL_ID++
        const layer = 'zones'

        return {
          ...feature,
          id: GLOBAL_ID,
          properties: {
            ...feature.properties,
            layer,
            zone: zoneMapping[feature.properties?.Kod_parkovacej_karty],
          },
        } as Feature<Polygon>
      })
      .filter((z) => z.properties?.zone && z.properties.Dátum_spustenia),
  }

  // @ts-ignore
  const markersData = addZonePropertyToLayer(
    {
      type: 'FeatureCollection',
      features: [
        /*
        BRANCHES
      */
        ...rawBranchesData.features.map((feature) => {
          GLOBAL_ID++
          const kind = MapPointKindEnum.branch
          const icon = MapPointIconEnum.branch
          const properties = {
            ...feature.properties,
            kind,
            icon,
          }
          const normalizedProperties = normalizePoint(properties)

          return {
            ...feature,
            id: GLOBAL_ID,
            properties: normalizedProperties,
          } as Feature<Point, MapPointWithTranslationProps>
        }),

        /*
        PARKOMATS
      */
        ...rawParkomatsData.features
          .filter((f) => f.properties?.Web === 'ano')
          .map((feature) => {
            GLOBAL_ID++
            const kind = MapPointKindEnum.parkomat
            const icon = MapPointIconEnum.parkomat
            const properties = {
              ...feature.properties,
              kind,
              icon,
            }
            const normalizedProperties = normalizePoint(properties)

            return {
              ...feature,
              id: GLOBAL_ID,
              properties: normalizedProperties,
            } as Feature<Point, MapPointWithTranslationProps>
          }),

        /*
        PARTNERS
      */
        ...rawPartnersData.features
          .filter((f) => f.properties?.web === 'ano')
          .map((feature) => {
            GLOBAL_ID++
            const kind = MapPointKindEnum.partner
            const icon = MapPointIconEnum.partner
            const properties = {
              ...feature.properties,
              kind,
              icon,
            }
            const normalizedProperties = normalizePoint(properties)
            return {
              ...feature,
              id: GLOBAL_ID,
              properties: normalizedProperties,
            } as Feature<Point, MapPointWithTranslationProps>
          }),

        /*
        PARKING LOTS
      */
        ...rawParkingLotsData.features
          .filter((f) => f.properties?.web === 'ano')
          .map((feature) => {
            GLOBAL_ID++
            const type =
              feature.properties?.Typ_en == 'P+R'
                ? MapPointIconEnum.pPlusR
                : feature.properties?.Typ_en == 'garage'
                ? MapPointIconEnum.garage
                : MapPointIconEnum.parkingLot

            const kind =
              type == MapPointIconEnum.pPlusR
                ? MapPointKindEnum.pPlusR
                : type == MapPointIconEnum.garage
                ? MapPointKindEnum.garage
                : MapPointKindEnum.parkingLot
            const icon = type
            const properties = {
              ...feature.properties,
              kind,
              icon,
            }
            const normalizedProperties = normalizePoint(properties)

            return {
              ...feature,
              id: GLOBAL_ID,
              properties: normalizedProperties,
            } as Feature<Point, MapPointWithTranslationProps>
          }),
      ],
    } as FeatureCollection<Point, MapPointWithTranslationProps>,
    zonesData as FeatureCollection<Polygon, GeoJsonProperties>,
  )

  // @ts-ignore
  const udrData = addZonePropertyToLayer(
    {
      type: 'FeatureCollection',
      features: rawUdrData.features
        .filter(
          (f) =>
            (f.properties?.web === 'ano' || f.properties?.web === 'ano - planned') &&
            (f.properties?.Status === 'active' || f.properties?.Status === 'planned'),
        )
        .map((feature) => {
          GLOBAL_ID++
          const layer = MapLayerEnum.visitors
          const properties = {
            ...feature.properties,
            layer,
          }
          const normalizedProperties = normalizeZone(properties)

          return {
            ...feature,
            id: GLOBAL_ID,
            properties: normalizedProperties,
          } as UdrZoneFeature
        }),
    } as FeatureCollection<Polygon, MapUdrZoneWithTranslationProps>,
    zonesData as FeatureCollection<Polygon, MapUdrZoneWithTranslationProps>,
  )

  const odpData = {
    type: 'FeatureCollection',
    features: rawOdpData.features
      .map((feature) => {
        GLOBAL_ID++
        const layer = MapLayerEnum.residents

        return {
          ...feature,
          id: GLOBAL_ID,
          properties: {
            ...feature.properties,
            layer,
            zone: feature.properties?.Kod_parkovacej_zony,
          },
        } as Feature<Polygon, GeoJsonProperties>
      })
      .filter((f) => f.properties?.Status === 'active' || f.properties?.Status === 'planned'),
  } as FeatureCollection<Polygon, GeoJsonProperties>

  return {
    markersData,
    udrData,
    zonesData,
    odpData,
  }
}
