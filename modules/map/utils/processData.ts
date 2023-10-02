/* eslint-disable eslint-comments/no-unlimited-disable,unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import area from '@turf/area'
import booleanIntersects from '@turf/boolean-intersects'
import { Point, Polygon } from '@turf/helpers'
import intersect from '@turf/intersect'
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson'
import { IconsEnum } from '../constants'

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
  rawAssistantsData: FeatureCollection<Point, GeoJsonProperties>
  rawParkomatsData: FeatureCollection<Point, GeoJsonProperties>
  rawPartnersData: FeatureCollection<Point, GeoJsonProperties>
  rawParkingLotsData: FeatureCollection<Point, GeoJsonProperties>
  rawBranchesData: FeatureCollection<Point, GeoJsonProperties>
  rawUdrData: FeatureCollection<Polygon, GeoJsonProperties>
  rawOdpData: FeatureCollection<Polygon, GeoJsonProperties>
  rawZonesData: FeatureCollection<Polygon, GeoJsonProperties>
}

export const processData = ({
  rawZonesData,
  rawAssistantsData,
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
        ASSISTNANTS
      */
        ...rawAssistantsData.features
          .map((feature) => {
            GLOBAL_ID++
            const kind = 'assistants'
            const icon = 'assistant'

            return {
              ...feature,
              id: GLOBAL_ID,
              properties: {
                ...feature.properties,
                kind,
                icon,
              },
            } as Feature<Point, GeoJsonProperties>
          })
          .filter((f) => f.properties?.web === 'ano'),

        /*
        BRANCHES
      */
        ...rawBranchesData.features.map((feature) => {
          GLOBAL_ID++
          const kind = 'branches'
          const icon = 'branch'

          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              kind,
              icon,
            },
          } as Feature<Point, GeoJsonProperties>
        }),

        /*
        PARKOMATS
      */
        ...rawParkomatsData.features
          .map((feature) => {
            GLOBAL_ID++
            const kind = 'parkomats'
            const icon = 'parkomat'

            return {
              ...feature,
              id: GLOBAL_ID,
              properties: {
                ...feature.properties,
                kind,
                icon,
              },
            } as Feature<Point, GeoJsonProperties>
          })
          .filter((f) => f.properties?.Web === 'ano'),

        /*
        PARTNERS
      */
        ...rawPartnersData.features
          .map((feature) => {
            GLOBAL_ID++
            const kind = 'partners'
            const icon = 'partner'

            return {
              ...feature,
              id: GLOBAL_ID,
              properties: {
                ...feature.properties,
                kind,
                icon,
              },
            } as Feature<Point, GeoJsonProperties>
          })
          .filter((f) => f.properties?.web === 'ano'),

        /*
        PARKING LOTS
      */
        ...rawParkingLotsData.features
          .map((feature) => {
            GLOBAL_ID++
            const type =
              feature.properties?.Typ_en == 'P+R'
                ? 'p-plus-r'
                : feature.properties?.Typ_en == 'garage'
                ? 'garage'
                : 'parking-lot'

            const kind =
              type == 'p-plus-r' ? 'p-plus-r' : type == 'garage' ? 'garages' : 'parking-lots'
            const icon = type

            return {
              ...feature,
              id: GLOBAL_ID,
              properties: {
                ...feature.properties,
                kind,
                icon,
              },
            } as Feature<Point, GeoJsonProperties>
          })
          .filter((f) => f.properties?.web === 'ano'),
      ],
    } as FeatureCollection<Point, GeoJsonProperties | { icon: IconsEnum }>,
    zonesData as FeatureCollection<Polygon, GeoJsonProperties>,
  )

  // @ts-ignore
  const udrData = addZonePropertyToLayer(
    {
      type: 'FeatureCollection',
      features: rawUdrData.features
        .map((feature) => {
          GLOBAL_ID++
          const layer = 'visitors'

          return {
            ...feature,
            id: GLOBAL_ID,
            properties: {
              ...feature.properties,
              layer,
            },
          } as Feature<Polygon, GeoJsonProperties>
        })
        .filter(
          (f) =>
            (f.properties?.web === 'ano' || f.properties?.web === 'ano - planned') &&
            (f.properties?.Status === 'active' || f.properties?.Status === 'planned'),
        ),
    } as FeatureCollection<Polygon, GeoJsonProperties>,
    zonesData as FeatureCollection<Polygon, GeoJsonProperties>,
  )

  const odpData = {
    type: 'FeatureCollection',
    features: rawOdpData.features
      .map((feature) => {
        GLOBAL_ID++
        const layer = 'residents'

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
