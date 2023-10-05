import clsx from 'clsx'
import React from 'react'
import { View } from 'react-native'

import AvatarSquare from '@/components/info/AvatarSquare'
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
const VisitorCardMethod = ({ selected, showControlChevron }: Props) => {
  const t = useTranslation('PaymentMethods')

  return (
    <Panel className={clsx(selected && 'border border-visitorCard')}>
      <FlexRow>
        <View>
          <AvatarSquare variant="visitor-card" />
        </View>
        <View className="flex-1 g-3">
          <FlexRow>
            <View className="flex-1">
              <Typography variant="default-bold">{t('visitorCard')}</Typography>
              <Typography variant="small">email@email.com</Typography>
            </View>
            {selected && <Icon name="check-circle" />}
            {showControlChevron && <Icon name="expand-more" />}
          </FlexRow>
          <Divider />
          <FlexRow>
            <Typography variant="small">{t('remaining')}</Typography>
            <Typography variant="small-bold">48h 30 min / 140h</Typography>
          </FlexRow>
        </View>
      </FlexRow>
    </Panel>
  )
}

export default VisitorCardMethod
