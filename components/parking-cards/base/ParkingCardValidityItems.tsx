import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatValidUntilDate } from '@/utils/formatValidUntilDate'

type Props = {
  validFrom?: string
  validUntil?: string
}

export const ParkingCardValidityItems = ({ validFrom, validUntil }: Props) => {
  const { t } = useTranslation()
  const locale = useLocale()

  const isValidInTheFuture = validFrom && new Date(validFrom).getTime() > Date.now()

  return (
    <>
      {validFrom && isValidInTheFuture ? (
        <CardContentItem
          description={t('ParkingCards.validFrom')}
          value={formatValidUntilDate(validFrom, locale)}
        />
      ) : null}

      {validUntil ? (
        <CardContentItem
          description={t('ParkingCards.validUntil')}
          value={formatValidUntilDate(validUntil, locale)}
        />
      ) : null}
    </>
  )
}
