import React from 'react'

import FlexRow from '@/components/shared/FlexRow'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { GetTicketPriceResponseDto } from '@/modules/backend/openapi-generated'
import { formatPrice } from '@/utils/formatPrice'

type Props = {
  priceData: GetTicketPriceResponseDto | undefined
}

const PurchaseSummaryRow = ({ priceData }: Props) => {
  const { t } = useTranslation()
  const locale = useLocale()

  /* Toggling visibility instead hiding by "display: none" prevents layout shifts */
  return (
    <FlexRow className={priceData ? 'visible' : 'hidden'}>
      <Typography variant="default-bold">{t('PurchaseScreen.summary')}</Typography>
      {priceData ? (
        <Typography variant="default-bold">{formatPrice(priceData.priceTotal, locale)}</Typography>
      ) : null}
    </FlexRow>
  )
}

export default PurchaseSummaryRow
