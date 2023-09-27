import clsx from 'clsx'
import React from 'react'
import { View } from 'react-native'

import AvatarSquare from '@/components/info/AvatarSquare'
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

const PaymentGate = ({ selected, showControlChevron }: Props) => {
  const t = useTranslation('PaymentMethods')

  return (
    <Panel className={clsx(selected && 'border border-dark')}>
      <FlexRow cn="items-center">
        <AvatarSquare variant="payment-gate" />
        <View className="flex-1">
          <Typography variant="default-bold">{t('paymentGate')}</Typography>
        </View>
        {selected && <Icon name="check-circle" />}
        {showControlChevron && <Icon name="expand-more" />}
      </FlexRow>
    </Panel>
  )
}

export default PaymentGate
