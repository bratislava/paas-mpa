import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { MapUdrZone } from '@/modules/map/types'

/**
 * Function to create price request body needed for having fresh parkingStart
 * otherwise useMemo would store old time value and it cannot be changed to new one without having infinite loop
 * @param param0 object with udr, licencePlate, duration, npk
 * @returns price request body
 */
export const createPriceRequestBody = ({
  udr,
  licencePlate,
  duration,
  npk,
}: {
  udr: MapUdrZone | null
  licencePlate: string
  duration: number
  npk: ParkingCardDto | null
}) => {
  const dateNow = Date.now()
  const parkingStart = new Date(dateNow).toISOString()
  const parkingEnd = new Date(dateNow + duration * 1000).toISOString()

  return {
    npkId: npk?.identificator || undefined,
    ticket: {
      udr: String(udr?.udrId) ?? '',
      udrUuid: udr?.udrUuid ?? '',
      ecv: licencePlate ?? '',
      parkingStart,
      parkingEnd,
    },
  }
}
