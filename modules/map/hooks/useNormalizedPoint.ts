import { useMemo } from 'react'

import { useLocale } from '@/hooks/useTranslation'
import { MapInterestPoint, NormalizedPoint } from '@/modules/map/types'
import { normalizePoint } from '@/modules/map/utils/normalizePoint'

export function useNormalizedPoint<Point extends MapInterestPoint | undefined | null>(
  point: Point,
): Point extends undefined | null ? NormalizedPoint | null : NormalizedPoint
export function useNormalizedPoint(
  point: MapInterestPoint | undefined | null,
): NormalizedPoint | null {
  const locale = useLocale()

  return useMemo(() => (point ? normalizePoint(point, locale) : null), [locale, point])
}
