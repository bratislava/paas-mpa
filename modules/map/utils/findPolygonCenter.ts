import booleanIntersects from '@turf/boolean-intersects'
import { MultiPolygon, Point, Polygon } from 'geojson'

export const findPolygonCenter = (coordinates: number[][][] | number[][][][]): [number, number] => {
  let sumLon = 0
  let sumLat = 0
  let pointCount = 0

  const isMultiPolygon = Array.isArray(coordinates[0][0][0])

  coordinates.flat(isMultiPolygon ? 2 : 1).forEach((point) => {
    const [lon, lat] = point as number[]
    sumLon += lon
    sumLat += lat
    pointCount += 1
  })

  const centerLon = sumLon / pointCount
  const centerLat = sumLat / pointCount

  return [centerLon, centerLat]
}

/** GeoJSON Polygon/MultiPolygon feature for Turf */
function toTurfFeature(
  coordinates: number[] | number[][][] | number[][][][],
): Point | Polygon | MultiPolygon {
  if (!Array.isArray(coordinates[0])) {
    return { type: 'Point', coordinates: coordinates as [number, number] }
  }

  const isMultiPolygon = Array.isArray(coordinates[0][0][0])

  return isMultiPolygon
    ? { type: 'MultiPolygon', coordinates: coordinates as number[][][][] }
    : { type: 'Polygon', coordinates: coordinates as number[][][] }
}

/**
 * Returns a point that is guaranteed to be inside the polygon (or multipolygon).
 * Used when flying to a UDR so the map pin is unambiguously inside the chosen zone,
 * avoiding edge points where overlapping polygons can cause the wrong zone to be selected.
 *
 * @param coordinates Polygon or MultiPolygon coordinates (GeoJSON format)
 */
export const findPointInsidePolygon = (
  coordinates: number[][][] | number[][][][],
): [number, number] => {
  const firstPolygon = (
    Array.isArray(coordinates[0][0][0]) ? coordinates[0] : coordinates
  ) as number[][][]
  const feature = toTurfFeature(firstPolygon)
  const centroid = findPolygonCenter(firstPolygon)

  if (booleanIntersects(toTurfFeature(centroid), feature)) {
    return centroid
  }

  // Centroid is outside (e.g. concave polygon). Find an interior point by
  // walking from the middle of the first edge in perpendicular direction.

  const firstVertex = firstPolygon[0][0] as [number, number]
  const secondVertex = firstPolygon[0][1]
  const middleVertex = [
    (firstVertex[0] + secondVertex[0]) / 2,
    (firstVertex[1] + secondVertex[1]) / 2,
  ] as [number, number]
  // Calculate the perpendicular vector and normalize it to a unit vector of a reasonable length.
  const perpendicular = [firstVertex[1] - secondVertex[1], secondVertex[0] - firstVertex[0]]
  const normalizationScalar = 0.0001 / Math.hypot(perpendicular[0], perpendicular[1])

  for (let i = 1; i <= 10; i += 1) {
    // Walk in both directions to ensure we find a point inside the polygon
    const sign = (-1) ** i
    const reducedScalar = normalizationScalar / i

    const lon = middleVertex[0] + sign * reducedScalar * perpendicular[0]
    const lat = middleVertex[1] + sign * reducedScalar * perpendicular[1]

    if (booleanIntersects(toTurfFeature([lon, lat]), feature)) {
      return [lon, lat]
    }
  }

  // Fallback: return first vertex
  return firstVertex
}
