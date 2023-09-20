import React from 'react'
import { View } from 'react-native'

import AvatarCircle from '@/components/info/AvatarCircle'
import AvatarSquare from '@/components/info/AvatarSquare'

const AvatarShowcase = () => {
  return (
    <View className="flex-row flex-wrap px-4 g-4">
      <AvatarCircle variant="info" />
      <AvatarCircle variant="success" />
      <AvatarCircle variant="warning" />
      <AvatarCircle variant="error" />
      <AvatarCircle variant="thumbUp" />
      <AvatarCircle variant="noGps" />

      <AvatarSquare variant="payment-gate" />
      <AvatarSquare variant="visitor-card" />
    </View>
  )
}

export default AvatarShowcase
