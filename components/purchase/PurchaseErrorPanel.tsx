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
