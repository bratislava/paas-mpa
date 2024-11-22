import { View } from 'react-native'

import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const useMissingCardTranslations = (areCardsPresent?: boolean) => {
  const { t } = useTranslation()

  return areCardsPresent
    ? {
        title: t('ParkingCards.cannotFindCards.cardPresent.title'),
        text: t('ParkingCards.cannotFindCards.cardPresent.text'),
      }
    : {
        title: t('ParkingCards.cannotFindCards.title'),
        text: t('ParkingCards.cannotFindCards.text'),
      }
}

const MissingCardCallout = ({ areCardsPresent }: { areCardsPresent?: boolean }) => {
  const translations = useMissingCardTranslations(areCardsPresent)

  return (
    <View className="px-5 py-6 g-2">
      <Typography variant="h2">{translations.title}</Typography>
      <Markdown>{translations.text}</Markdown>
    </View>
  )
}

export default MissingCardCallout
