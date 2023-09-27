import { FeatureCollection, Point, Polygon } from 'geojson'

import { getIntersectionOfFeatureFromFeatures } from './getIntersectionOfFeatureFromFeatures'

export const addZonePropertyToLayer = (
  featureCollection: FeatureCollection<Polygon | Point>,
  zonesCollection: FeatureCollection<Polygon>,
) => ({
  ...featureCollection,
  features: featureCollection.features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      zone: getIntersectionOfFeatureFromFeatures(feature, zonesCollection)?.properties?.zone,
    },
  })),
})
