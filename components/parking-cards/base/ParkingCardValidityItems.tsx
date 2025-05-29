import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatCardValidityDate } from '@/utils/formatCardValidityDate'

type Props = {
  validFrom?: string
  validUntil?: string
}

export const ParkingCardValidityItems = ({ validFrom, validUntil }: Props) => {
  const { t } = useTranslation()
  const locale = useLocale()

  const isValidFromInTheFuture = validFrom && new Date(validFrom).getTime() > Date.now()

  return (
    <>
      {validFrom && isValidFromInTheFuture ? (
        <CardContentItem
          description={t('ParkingCards.validFrom')}
          value={formatCardValidityDate(validFrom, locale)}
        />
      ) : null}

      {validUntil ? (
        <CardContentItem
          description={t('ParkingCards.validUntil')}
          value={formatCardValidityDate(validUntil, locale)}
        />
      ) : null}
    </>
  )
}
