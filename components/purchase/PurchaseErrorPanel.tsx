import { UseQueryResult } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import React from 'react'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { isPricingApiError } from '@/utils/errorPricingApi'

type Props = {
  priceQuery: UseQueryResult<GetTicketPriceResponseDto, Error>
}

const PurchaseErrorPanel = ({ priceQuery }: Props) => {
  const { t } = useTranslation()
  const { udr, vehicle } = usePurchaseStoreContext()

  // TODO translations
  const translationKeys = [
    t('Errors.422'),
    t('Errors.DATABASE_ERROR'),
    t('Errors.MAILGUN_ERROR'),
    t('Errors.RABBIT_MQ_ERROR'),
    t('Errors.axiosGeneric'),
    t('Errors.generic'),
    t('Errors.BadDateFormat'),
    t('Errors.BadRequest'),
    t('Errors.CardNotValid'),
    t('Errors.FreeTicket'),
    t('Errors.InsufficientCredit'),
    t('Errors.InvalidParkingEnd'),
    t('Errors.InvalidParkingStart'),
    t('Errors.InvalidParkingTime'),
    t('Errors.LicencePlate'),
    t('Errors.NoUsableParkingCardFound'),
    t('Errors.PermitCardActive'),
    t('Errors.TicketAlreadyExists'),
    t('Errors.TicketAlreadyShortened'),
    t('Errors.TooLongParkingTime'),
    t('Errors.TooShortParkingTime'),
    t('Errors.parkingSpaceNotFound'),
  ]

  return !priceQuery.data &&
    priceQuery.isError &&
    isAxiosError(priceQuery.error) &&
    priceQuery.error.response?.status === 422 &&
    isPricingApiError(priceQuery.error.response.data) ? (
    <Panel className="bg-negative-light px-5 py-4">
      <Typography>
        {t(`Errors.${priceQuery.error.response.data.status}`, {
          ecv: vehicle?.vehiclePlateNumber,
          udr: udr?.name,
        })}
      </Typography>
    </Panel>
  ) : null
}

export default PurchaseErrorPanel
