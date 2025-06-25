import { View } from 'react-native'

import { EmptyStateAvatar } from '@/assets/avatars'
import MissingCardCallout from '@/components/parking-cards/MissingCardCallout'
import { ValidityKey } from '@/components/parking-cards/ParkingCardsFilter'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  validityKey: ValidityKey
}

export const ParkingCardsEmptyState = ({ validityKey }: Props) => {
  const { t } = useTranslation()

  return (
    <View className="flex-1 justify-center">
      <ContentWithAvatar
        title={
          validityKey === 'all'
            ? t('ParkingCards.noActiveCardsTitle')
            : t('ParkingCards.noActiveCardsTitleFiltered')
        }
        text={
          validityKey === 'all'
            ? t('ParkingCards.noActiveCardsText')
            : t('ParkingCards.noActiveCardsTextFiltered')
        }
        customAvatarComponent={<EmptyStateAvatar />}
        actionButton={<MissingCardCallout />}
      />
    </View>
  )
}
