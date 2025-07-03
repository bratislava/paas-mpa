import React from 'react'
import { View } from 'react-native'

import Icon from '@/components/shared/Icon'

// Figma: https://www.figma.com/design/3TppNabuUdnCChkHG9Vft7/Paas---mpa?node-id=10045-13949&t=UteJEHB77Ye1oabD-4

const AvatarCircleFeedbackForm = () => {
  return (
    <View className="flex items-center justify-center rounded-full bg-green-light p-6">
      <Icon name="assistant" className="text-green" size={32} />
    </View>
  )
}

export default AvatarCircleFeedbackForm
