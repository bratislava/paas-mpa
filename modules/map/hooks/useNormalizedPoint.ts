import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { MapInterestPoint, NormalizedPoint } from '@/modules/map/types'
import { normalizePoint } from '@/modules/map/utils/normalizePoint'

export function useNormalizedPoint<Point extends MapInterestPoint | undefined | null>(
  point: Point,
): Point extends undefined | null ? NormalizedPoint | null : NormalizedPoint
export function useNormalizedPoint(
  point: MapInterestPoint | undefined | null,
): NormalizedPoint | null {
  const [, i18n] = useTranslation()

  return useMemo(
    () => (point ? normalizePoint(point, i18n.language) : null),
    [i18n.language, point],
  )
}
