import React from 'react'
import { View } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import AvatarCircleFeedback from '@/components/info/AvatarCircleFeedback'
import AvatarCircleLocationOff from '@/components/info/AvatarCircleLocationOff'
import AvatarSquare from '@/components/info/AvatarSquare'
import Panel from '@/components/shared/Panel'

const AvatarShowcase = () => {
  return (
    <View className="flex-row flex-wrap items-center px-4 g-4">
      <AvatarCircle variant="info" />
      <AvatarCircle variant="success" />
      <AvatarCircle variant="warning" />
      <AvatarCircle variant="error" />

      <AvatarCircleFeedback />
      <AvatarCircleLocationOff />

      <Panel className="flex-row flex-wrap g-4">
        <AvatarSquare variant="payment-card" />
        <AvatarSquare variant="visitor-card" />
        <AvatarSquare variant="apple-pay" />
        <AvatarSquare variant="google-pay" />
      </Panel>
    </View>
  )
}

export default AvatarShowcase
