import React from 'react'
import { View } from 'react-native'

import AvatarSquare from '@/components/info/AvatarSquare'
import FlexRow from '@/components/shared/FlexRow'
import IconButton from '@/components/shared/IconButton'
import PanelPressable from '@/components/shared/PanelPressable'
import Typography from '@/components/shared/Typography'

const PaymentGate = () => {
  return (
    <PanelPressable>
      <FlexRow cn="items-center">
        <AvatarSquare variant="payment-gate" />
        <View className="flex-1">
          {/* TODO translation */}
          <Typography variant="default-bold">Platobná karta / Apple Pay / Google Pay</Typography>
        </View>
        <IconButton name="expand-more" accessibilityLabel="Expand more" />
      </FlexRow>
    </PanelPressable>
  )
}

export default PaymentGate
