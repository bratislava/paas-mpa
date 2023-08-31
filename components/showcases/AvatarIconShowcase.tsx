import React from 'react'
import { View } from 'react-native'

import AvatarIcon from '@/components/action-info/AvatarIcon'

const AvatarIconShowcase = () => {
  return (
    <View className="g-4">
      <AvatarIcon variant="info" />
      <AvatarIcon variant="success" />
      <AvatarIcon variant="warning" />
      <AvatarIcon variant="error" />
    </View>
  )
}

export default AvatarIconShowcase
