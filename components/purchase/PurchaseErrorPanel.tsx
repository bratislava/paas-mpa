import { UseQueryResult } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import React from 'react'

import Markdown from '@/components/shared/Markdown'
import Panel from '@/components/shared/Panel'
import { useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { isPricingApiError } from '@/utils/errorPricingApi'
import { isDefined } from '@/utils/isDefined'

type Props = {
  priceQuery: UseQueryResult<GetTicketPriceResponseDto, Error>
}

const PurchaseErrorPanel = ({ priceQuery }: Props) => {
  const { t } = useTranslation()
  const { udr, vehicle } = usePurchaseStoreContext()

  // TODO translation
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
      <Markdown>
        {/* TODO translation */}
        {t(`PurchaseScreen.Errors.${priceQuery.error.response.data.status}`, {
          ecv: vehicle?.vehiclePlateNumber,
          udr: [udr?.udrId, udr?.name].filter(isDefined).join(' '),
        })}
      </Markdown>
    </Panel>
  ) : null
}

export default PurchaseErrorPanel
