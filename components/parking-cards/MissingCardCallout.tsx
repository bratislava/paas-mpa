import { View } from 'react-native'

import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

const MissingCardCallout = () => {
  const { t } = useTranslation()

  return (
    <View className="px-5 py-6 g-2">
      <Typography variant="h2">{t('ParkingCards.cannotFindCard.title')}</Typography>
      <Markdown>{t('ParkingCards.cannotFindCard.text')}</Markdown>
    </View>
  )
}

export default MissingCardCallout
