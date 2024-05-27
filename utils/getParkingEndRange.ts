import { FilterTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'

export const getParkingEndRange = (timeframe: FilterTimeframesEnum, now: Date) => {
  switch (timeframe) {
    case FilterTimeframesEnum.thisMonth:
      return {
        parkingEndFrom: new Date(now.getFullYear(), now.getMonth(), 1),
        parkingEndTo: now,
      }

    case FilterTimeframesEnum.lastMonth:
      return {
        parkingEndFrom: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        parkingEndTo: new Date(now.getFullYear(), now.getMonth(), 0),
      }

    case FilterTimeframesEnum.thisYear:
      return {
        parkingEndFrom: new Date(now.getFullYear(), 0),
        parkingEndTo: now,
      }

    case FilterTimeframesEnum.lastYear:
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
