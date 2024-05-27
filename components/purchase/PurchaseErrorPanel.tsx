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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const translationKeys = [
    t('Errors.422'),
    t('Errors.DATABASE_ERROR'),
    t('Errors.MAILGUN_ERROR'),
    t('Errors.RABBIT_MQ_ERROR'),
    t('PurchaseScreen.Errors.BadDateFormat'),
    t('PurchaseScreen.Errors.BadRequest'),
    t('PurchaseScreen.Errors.CardNotValid'),
    t('PurchaseScreen.Errors.FreeTicket'),
    t('PurchaseScreen.Errors.InsufficientCredit'),
    t('PurchaseScreen.Errors.InvalidParkingEnd'),
    t('PurchaseScreen.Errors.InvalidParkingStart'),
    t('PurchaseScreen.Errors.InvalidParkingTime'),
    t('PurchaseScreen.Errors.LicencePlate'),
    t('PurchaseScreen.Errors.NoUsableParkingCardFound'),
    t('PurchaseScreen.Errors.PermitCardActive'),
    t('PurchaseScreen.Errors.TicketAlreadyExists'),
    t('PurchaseScreen.Errors.TicketAlreadyShortened'),
    t('PurchaseScreen.Errors.TooLongParkingTime'),
    t('PurchaseScreen.Errors.TooShortParkingTime'),
    t('PurchaseScreen.Errors.parkingSpaceNotFound'),
  ]

  return !priceQuery.data &&
    priceQuery.isError &&
    isAxiosError(priceQuery.error) &&
    priceQuery.error.response?.status === 422 &&
    isPricingApiError(priceQuery.error.response.data) ? (
    <Panel className="bg-negative-light px-5 py-4">
      <Typography>
        {t(`PurchaseScreen.Errors.${priceQuery.error.response.data.status}`, {
          ecv: vehicle?.vehiclePlateNumber,
          udr: udr?.name,
        })}
      </Typography>
    </Panel>
  ) : null
}

export default PurchaseErrorPanel
