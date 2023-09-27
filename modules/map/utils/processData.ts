/* eslint-disable eslint-comments/no-unlimited-disable,unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { Point, Polygon } from '@turf/helpers'
import { Feature, FeatureCollection } from 'geojson'
import { addZonePropertyToLayer } from './addZonePropertyToLayer'

const zoneMapping = {
  SM1: 'SM1',
  NM1a: 'NM1',
  RU1: 'RU1',
  RA1: 'RA1',
  'PE1-Dvory IV': 'PE1',
} as { [key: string]: string }

export interface ProcessDataOptions {
  rawAssistantsData: FeatureCollection | null
  rawParkomatsData: FeatureCollection | null
  rawPartnersData: FeatureCollection | null
  rawParkingLotsData: FeatureCollection | null
  rawBranchesData: FeatureCollection | null
  rawUdrData: FeatureCollection<any> | null
  rawOdpData: FeatureCollection<any> | null
  rawZonesData: FeatureCollection<any> | null
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

  const zonesData: FeatureCollection<Polygon> = {
    type: 'FeatureCollection',
    features:
      rawZonesData?.features
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
        .filter((z) => z.properties?.zone && z.properties.Dátum_spustenia) ?? [],
  }

  const markersData: FeatureCollection = addZonePropertyToLayer(
    {
      type: 'FeatureCollection',
      features: [
        /*
        ASSISTNANTS
      */
        ...(rawAssistantsData?.features
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
            } as Feature
          })
          .filter((f) => f.properties?.web === 'ano') ?? []),

        /*
        BRANCHES
      */
        ...(rawBranchesData?.features.map((feature) => {
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
          } as Feature
        }) ?? []),

        /*
        PARKOMATS
      */
        ...(rawParkomatsData?.features
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
            } as Feature
          })
          .filter((f) => f.properties?.Web === 'ano') ?? []),

        /*
        PARTNERS
      */
        ...(rawPartnersData?.features
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
            } as Feature
          })
          .filter((f) => f.properties?.web === 'ano') ?? []),

        /*
        PARKING LOTS
      */
        ...(rawParkingLotsData?.features
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
            } as Feature
          })
          .filter((f) => f.properties?.web === 'ano') ?? []),
      ],
    } as FeatureCollection<Point>,
    zonesData,
  )

  const udrData: FeatureCollection = addZonePropertyToLayer(
    {
      type: 'FeatureCollection',
      features: rawUdrData?.features
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
          } as Feature
        })
        .filter(
          (f) =>
            (f.properties?.web === 'ano' || f.properties?.web === 'ano - planned') &&
            (f.properties?.Status === 'active' || f.properties?.Status === 'planned'),
        ),
    } as FeatureCollection<Polygon>,
    zonesData,
  )

  const odpData: FeatureCollection = {
    type: 'FeatureCollection',
    features: rawOdpData?.features
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
        } as Feature
      })
      .filter((f) => f.properties?.Status === 'active' || f.properties?.Status === 'planned'),
  } as FeatureCollection<Polygon>

  return {
    markersData,
    udrData,
    zonesData,
    odpData,
  }
}
