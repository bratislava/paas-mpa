import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'

export const getDurationFromPriceData = (priceData: GetTicketPriceResponseDto | undefined) => {
  if (!priceData) {
    return null
  }

  const ticketStartDate = new Date(priceData.ticketStart)
  const ticketEndDate = new Date(priceData.ticketEnd)

  // Difference in milliseconds
  const diff = ticketEndDate.getTime() - ticketStartDate.getTime()

  return diff / 1000
}
