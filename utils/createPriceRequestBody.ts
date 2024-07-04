import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { MapUdrZone } from '@/modules/map/types'

/**
 * Function to create price request body needed for having fresh parkingStart
 * otherwise useMemo would store old time value, and it cannot be changed to new one without having infinite loop
 * @param param0 object with udr, licencePlate, duration, npk and rememberCard
 * @returns price request body
 */
export const createPriceRequestBody = ({
  udr,
  licencePlate,
  duration,
  npk,
  rememberCard,
}: {
  udr: MapUdrZone | null
  licencePlate: string
  duration: number
  npk: ParkingCardDto | null
  rememberCard?: boolean
}) => {
  // Set time to whole minutes. Otherwise, it would charge several seconds more in some cases.
  // E.g. when buying the ticket before the paid period (in this case parkingStart has whole minutes and parkingEnd must have too)
  const dateNow = new Date().setSeconds(0, 0)
  const parkingStart = new Date(dateNow).toISOString()
  const parkingEnd = new Date(dateNow + duration * 1000).toISOString()

  return {
    npkId: npk?.identificator || undefined, // TODO If `|| undefined` is intentional, please explain in comment.
    ticket: {
      udr: String(udr?.udrId) ?? '',
      ecv: licencePlate ?? '',
      parkingStart,
      parkingEnd,
    },
    rememberCard,
  }
}
