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

// TODO: update this to always navigate to a point that is *inside* the zone, now it not always happends
/** Finds the coordinate of the polygon that is closest to the center, used during navigating to a zone,
 * when choosing a point that is inside the zone it should be selected after naviagting to it */
export const findMostCenterPointInPolygon = (
  coordinates: number[][][] | number[][][][],
): [number, number] => {
  const center = findPolygonCenter(coordinates)
  let nearestPoint: [number, number] = [0, 0]
  let minDistance = Number.MAX_VALUE

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
