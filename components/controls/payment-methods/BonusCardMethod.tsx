import clsx from 'clsx'
import React from 'react'
import { View } from 'react-native'

import Divider from '@/components/shared/Divider'
import FlexRow from '@/components/shared/FlexRow'
import Icon from '@/components/shared/Icon'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// Ensure that only one of these props is set at a time
type Props =
  | {
      selected?: boolean
      showControlChevron?: never
    }
  | {
      selected?: never
      showControlChevron?: boolean
    }

// TODO props
// TODO this component probably does not need selected/showControlChevron props
const BonusCardMethod = ({ selected, showControlChevron }: Props) => {
  const t = useTranslation('PaymentMethods')

  return (
    <Panel className={clsx(selected && 'border border-dark')}>
      <View className="g-3">
        <FlexRow>
          <View className="flex-1">
            <Typography variant="default-bold">{t('bonusCard')}</Typography>
            {/* <Typography variant="small">ECV</Typography> */}
          </View>
          {selected && <Icon name="check-circle" />}
          {showControlChevron && <Icon name="expand-more" />}
        </FlexRow>
        <Divider />
        <FlexRow>
          <Typography variant="small">{t('todayRemaining')}</Typography>
          <Typography variant="small-bold">120 min</Typography>
        </FlexRow>
        <FlexRow>
          <Typography variant="small">{t('validUntil')}</Typography>
          <Typography variant="small-bold">April 12, 2024</Typography>
        </FlexRow>
      </View>
    </Panel>
  )
}

export default BonusCardMethod
