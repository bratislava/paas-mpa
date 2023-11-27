import { FilteringTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'

export const transformTimeframeToFromTo = (
  timeframe: FilteringTimeframesEnum | null,
  now: Date,
) => {
  switch (timeframe) {
    case FilteringTimeframesEnum.thisMonth:
      return {
        parkingEndFrom: new Date(now.getFullYear(), now.getMonth(), 1),
        parkingEndTo: now,
      }
    case FilteringTimeframesEnum.lastMonth:
      return {
        parkingEndFrom: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        parkingEndTo: new Date(now.getFullYear(), now.getMonth(), 0),
      }
    case FilteringTimeframesEnum.thisYear:
      return {
        parkingEndFrom: new Date(now.getFullYear(), 0),
        parkingEndTo: now,
      }
    case FilteringTimeframesEnum.lastYear:
      return {
        parkingEndFrom: new Date(now.getFullYear() - 1, 0),
        parkingEndTo: new Date(now.getFullYear(), -1, 31),
      }
    default:
      return {
        parkingEndFrom: now,
        parkingEndTo: undefined,
      }
  }
}
