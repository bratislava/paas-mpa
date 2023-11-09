export const findPolygonCenter = (coordinates: number[][][]): [number, number] => {
  console.log(coordinates)
  let sumLon = 0
  let sumLat = 0
  let pointCount = 0

  coordinates.forEach((line) =>
    line.forEach((point) => {
      sumLon += point[0]
      sumLat += point[1]
      pointCount += 1
    }),
  )

  const centerLon = sumLon / pointCount
  const centerLat = sumLat / pointCount

  console.log(centerLon, centerLat)

  return [centerLon, centerLat]
}

// TODO: update this to always navigate to a point that is *inside* the zone, now it not always happends
/** Finds the coordinate of the polygon that is closest to the center, used during navigating to a zone,
 * when choosing a point that is inside the zone it should be selected after naviagting to it */
export const findMostCenterPointInPolygon = (coordinates: number[][][]): [number, number] => {
  const center = findPolygonCenter(coordinates)
  let nearestPoint: [number, number] = [0, 0]
  let minDistance = Number.MAX_VALUE

  coordinates.forEach((line) =>
    line.forEach((point) => {
      const distance = Math.hypot(point[0] - center[0], point[1] - center[1])

      if (distance < minDistance) {
        minDistance = distance
        nearestPoint = point as [number, number]
      }
    }),
  )

  return nearestPoint
}
