import React from 'react'
import { View } from 'react-native'

import Icon from '@/components/shared/Icon'

// Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=3184%3A13963&mode=dev

const AvatarCircleFeedback = () => {
  return (
    <View className="flex items-center justify-center rounded-full bg-green-light p-6">
      <Icon name="thumb-up" className="text-green" size={32} />
    </View>
  )
}

export default AvatarCircleFeedback
