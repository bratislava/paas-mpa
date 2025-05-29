import { ScrollView, View } from 'react-native'

import Chip from '@/components/shared/Chip'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'

export type ValidityKey = 'all' | 'actual' | 'expired' | 'future'

export type CardFilter = {
  validFromTo?: Date
  validToFrom?: Date
  validToTo?: Date
  validFromFrom?: Date
}

type Props = {
  selectedKey: ValidityKey
  onChange: (key: ValidityKey) => void
}

export const ParkingCardsFilter = ({ selectedKey, onChange }: Props) => {
  const { t } = useTranslation()

  const SHOWN_FILTERS: { key: ValidityKey; label: string }[] = [
    {
      key: 'all',
      label: t('ParkingCards.filter.all'),
    },
    {
      key: 'actual',
      label: t('ParkingCards.filter.actual'),
    },
    {
      key: 'expired',
      label: t('ParkingCards.filter.expired'),
    },
    {
      key: 'future',
      label: t('ParkingCards.filter.future'),
    },
  ]

  return (
    <View>
      <ScrollView className="h-[50px]" horizontal showsHorizontalScrollIndicator={false}>
        {SHOWN_FILTERS.map(({ key, label }) => (
          <PressableStyled key={key} onPress={() => onChange(key)}>
            <Chip className="mr-2 p-3" isActive={selectedKey === key} label={label} />
          </PressableStyled>
        ))}
      </ScrollView>
    </View>
  )
}
