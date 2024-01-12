import { Position } from 'geojson'

import { UdrZoneFeature } from '@/modules/map/types'

const calculateHaversineDistance = (point1: Position, point2: Position) => {
  const [lon1, lat1] = point1
  const [lon2, lat2] = point2

  const earthRadius = 6371 // in kilometers

  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

/** @param radius Radius around the center in km */
export const findShapesInRadius = (shapes: UdrZoneFeature[], center: Position, radius: number) => {
  const startTime = performance.now()

  const result = shapes
    .map((shape) => {
      const isMultiPolygon = Array.isArray(shape.geometry.coordinates[0][0][0])

      const points = shape.geometry.coordinates.flat(isMultiPolygon ? 2 : 1) as Position[]

      const pointsWithDistance = points.map((point) => {
        const [lon, lat] = point
        const distance = calculateHaversineDistance([lon, lat], center)

        return { point, distance }
      })

      const sortedPointsWithinDistance = pointsWithDistance
        .filter(({ distance }) => {
          return distance <= radius
        })
        .sort((point1, point2) => {
          return point1.distance - point2.distance
        })

      return { shape, distance: sortedPointsWithinDistance[0]?.distance ?? Number.MAX_VALUE }
    })
    .filter(({ distance }) => {
      return distance <= radius
    })
    .sort((shape1, shape2) => {
      return shape1.distance - shape2.distance
    })
    .map(({ shape }) => shape)

  const endTime = performance.now()
  console.log(`findShapesInRadius took ${endTime - startTime} ms`)

  return result
}
