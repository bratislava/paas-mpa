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

/** Finds the coordinate of a polygon or a multipolygon that is closest to the center, used during navigating to a zone,
 * when choosing a point that is inside the zone it should be selected after naviagting to it
 * @param coordinates A polygon or a multipolygon */
export const findMostCenterPointInPolygon = (
  coordinates: number[][][] | number[][][][],
): [number, number] => {
  const center = findPolygonCenter(coordinates)
  let nearestPoint: [number, number] = [0, 0]
  let minDistance = Number.MAX_VALUE

  /** A multipolygon consists of an array of polygons which consist of an array of lines which consist of an array of points. Points themselves are an array of 2 numbers, a longitude and a latitude. */
  const isMultiPolygon = Array.isArray(coordinates[0][0][0])

  coordinates.flat(isMultiPolygon ? 2 : 1).forEach((point) => {
    const [lon, lat] = point as number[]
    const distance = Math.hypot(lon - center[0], lat - center[1])

    if (distance < minDistance) {
      minDistance = distance
      nearestPoint = point as [number, number]
    }
  })

  if (nearestPoint[0] === 0 || nearestPoint[1] === 0) {
    return center
  }

  return nearestPoint
}
