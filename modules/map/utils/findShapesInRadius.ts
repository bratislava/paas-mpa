import { Feature, MultiPolygon, Polygon, Position } from 'geojson'

import { MapUdrZone } from '@/modules/map/types'

function getDistance(point1: Position, point2: Position): number {
  const [x1, y1] = point1
  const [x2, y2] = point2

  return Math.hypot(x2 - x1, y2 - y1)
}

export const findShapesInRadius = (
  shapes: Feature<Polygon | MultiPolygon, MapUdrZone>[],
  center: Position,
  radius: number,
) => {
  const startTime = performance.now()

  const result = shapes
    .map((shape) => {
      const isMultiPolygon = Array.isArray(shape.geometry.coordinates[0][0][0])

      const points = shape.geometry.coordinates.flat(isMultiPolygon ? 2 : 1) as Position[]

      const pointsWithDistance = points.map((point) => {
        const [lon, lat] = point
        const distance = getDistance([lon, lat], center)

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
