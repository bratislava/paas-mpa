import area from '@turf/area'
import booleanIntersects from '@turf/boolean-intersects'
import intersect from '@turf/intersect'
import { Feature, FeatureCollection, Point, Polygon } from 'geojson'

export const getIntersectionOfFeatureFromFeatures = (
  feature: Feature<Polygon | Point>,
  featureCollection: FeatureCollection<Polygon>,
) => {
  const availableFeatures = featureCollection.features

  // eslint-disable-next-line no-restricted-syntax
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
