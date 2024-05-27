import { useTranslation } from '@/hooks/useTranslation'
import { FilterTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'

export const useTimeframesTranslation = () => {
  const { t } = useTranslation()

  return {
    thisMonth: t('TicketsFilters.timeframes.thisMonth'),
    lastMonth: t('TicketsFilters.timeframes.lastMonth'),
    thisYear: t('TicketsFilters.timeframes.thisYear'),
    lastYear: t('TicketsFilters.timeframes.lastYear'),
  } satisfies Record<FilterTimeframesEnum, string>
}
