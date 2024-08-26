import { View } from 'react-native'

import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

export type ParkingCardTypeRowProps = {
  variant: 'bonus-cards' | 'visitor-cards' | 'all'
  selected?: boolean
}

const ParkingCardTypeRow = ({ variant, selected }: ParkingCardTypeRowProps) => {
  const { t } = useTranslation()

  // TODO test translations
  const translationsMap = {
    'bonus-cards': t('ParkingCardTypeRow.type.bonusCards'),
    'visitor-cards': t('ParkingCardTypeRow.type.visitorCards'),
    all: t('ParkingCardTypeRow.type.all'),
  } satisfies Record<typeof variant, string>

  return (
    <Panel className={cn('border', selected ? 'border-dark' : 'border-soft')}>
      <FlexRow className="items-center">
        <View className="flex-1 flex-row items-center g-3">
          {/* <AvatarSquare variant={variant} /> */}
          <Typography variant="default-bold">{translationsMap[variant]}</Typography>
        </View>
        {selected && <Icon name="check-circle" />}
      </FlexRow>
    </Panel>
  )
}

export default ParkingCardTypeRow
